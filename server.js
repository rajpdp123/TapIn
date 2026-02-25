const express = require('express');
const path = require('path');
const { db, stmts, generateVerificationCode } = require('./db');
const { getTodaySchedule, findClassForCheckin, DEALS } = require('./schedule');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Phone normalisation (E.164) ───
function normalizePhone(raw) {
  if (!raw) return null;
  let phone = raw.replace(/[\s\-\(\)]/g, '');
  if (phone.startsWith('0') && !phone.startsWith('00')) {
    phone = '+49' + phone.slice(1);
  }
  if (phone.startsWith('49') && phone.length > 10) {
    phone = '+' + phone;
  }
  if (phone.startsWith('00')) {
    phone = '+' + phone.slice(2);
  }
  if (!phone.startsWith('+')) {
    phone = '+49' + phone;
  }
  return phone;
}

// ─── Helper: perform check-in for a member ───
function performCheckin(member) {
  // Cooldown: one check-in per calendar day (Berlin time)
  const todayVisit = stmts.getTodayVisitForMember.get(member.id);
  if (todayVisit) {
    member = stmts.getMemberById.get(member.id);
    const visits = stmts.getVisitsByMember.all(member.id);
    const rewards = stmts.getRewardsByMember.all(member.id);
    return {
      member, visit: todayVisit, visits, rewards,
      already_checked_in: true, reward_earned: false, reward: null,
      message: "You're already checked in today!",
    };
  }

  const { class_name, class_time } = findClassForCheckin();
  const willEarnReward = member.current_stamp_count >= 9;

  stmts.updateMemberVisit.run(member.id);
  const visit = stmts.createVisit.get(member.id, class_name, class_time);

  let reward = null;
  if (willEarnReward) {
    const code = generateVerificationCode();
    reward = stmts.createReward.get(member.id, code);
  }

  member = stmts.getMemberById.get(member.id);
  const visits = stmts.getVisitsByMember.all(member.id);
  const rewards = stmts.getRewardsByMember.all(member.id);

  return {
    member, visit, visits, rewards,
    reward_earned: !!reward, reward,
    already_checked_in: false,
    message: class_name
      ? `Checked in for ${class_name} at ${class_time}!`
      : 'Checked in successfully!',
  };
}

// ─── API: Register ───
app.post('/api/register', (req, res) => {
  const phone = normalizePhone(req.body.phone);
  if (!phone) return res.status(400).json({ error: 'Phone number required' });

  let member = stmts.getMemberByPhone.get(phone);
  if (member) return res.json({ member, existing: true });

  member = stmts.createMemberWithPhone.get(phone);
  res.json({ member, existing: false });
});

// ─── API: Check-in (accepts phone OR device_id) ───
app.post('/api/checkin', (req, res) => {
  const phone = normalizePhone(req.body.phone);
  const deviceId = req.body.device_id;

  let member = null;

  if (phone) {
    member = stmts.getMemberByPhone.get(phone);
    if (!member) {
      member = stmts.createMemberWithPhone.get(phone);
    }
  } else if (deviceId) {
    member = stmts.getMemberByDeviceId.get(deviceId);
    if (!member) {
      member = stmts.createMemberWithDevice.get(deviceId);
    }
  } else {
    return res.status(400).json({ error: 'Phone or device_id required' });
  }

  res.json(performCheckin(member));
});

// ─── API: Get member by phone ───
app.get('/api/member/:phone', (req, res) => {
  const phone = normalizePhone(req.params.phone);
  if (!phone) return res.status(400).json({ error: 'Phone number required' });

  const member = stmts.getMemberByPhone.get(phone);
  if (!member) return res.status(404).json({ error: 'Member not found' });

  const visits = stmts.getVisitsByMember.all(member.id);
  const rewards = stmts.getRewardsByMember.all(member.id);

  res.json({ member, visits, rewards });
});

// ─── API: Link phone to member (by member id) ───
app.post('/api/member/:id/link-phone', (req, res) => {
  const memberId = parseInt(req.params.id, 10);
  const phone = normalizePhone(req.body.phone);
  if (!phone) return res.status(400).json({ error: 'Phone number required' });

  const member = stmts.getMemberById.get(memberId);
  if (!member) return res.status(404).json({ error: 'Member not found' });

  // Check if phone is already linked to another member
  const existing = stmts.getMemberByPhone.get(phone);
  if (existing && existing.id !== memberId) {
    // Merge: keep the one with more visits, transfer data from the other
    const keep = existing.visit_count >= member.visit_count ? existing : member;
    const discard = keep.id === existing.id ? member : existing;

    stmts.transferVisits.run(keep.id, discard.id);
    stmts.transferRewards.run(keep.id, discard.id);
    stmts.deleteMember.run(discard.id);

    // Ensure the kept member has the phone
    if (keep.id === member.id) {
      stmts.linkPhoneToMember.run(phone, keep.id);
    }

    const merged = stmts.getMemberById.get(keep.id);
    const visits = stmts.getVisitsByMember.all(keep.id);
    const rewards = stmts.getRewardsByMember.all(keep.id);
    return res.json({ member: merged, visits, rewards, merged: true });
  }

  // Simple link — no conflict
  stmts.linkPhoneToMember.run(phone, memberId);
  const updated = stmts.getMemberById.get(memberId);
  const visits = stmts.getVisitsByMember.all(memberId);
  const rewards = stmts.getRewardsByMember.all(memberId);

  res.json({ member: updated, visits, rewards, merged: false });
});

// ─── API: Update profile ───
app.post('/api/member/:phone/profile', (req, res) => {
  const phone = normalizePhone(req.params.phone);
  const { name, email } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number required' });

  stmts.updateMemberProfile.run(name || null, email || null, phone);
  const member = stmts.getMemberByPhone.get(phone);
  if (!member) return res.status(404).json({ error: 'Member not found' });

  res.json({ member });
});

// ─── API: Claim reward ───
app.post('/api/reward/:id/claim', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const reward = stmts.getRewardById.get(id);
  if (!reward) return res.status(404).json({ error: 'Reward not found' });
  if (reward.status === 'claimed') return res.json({ reward, already_claimed: true });

  stmts.claimReward.run(id);
  stmts.incrementRewardsClaimed.run(reward.member_id);

  res.json({ reward: stmts.getRewardById.get(id), already_claimed: false });
});

// ─── API: Today's schedule ───
app.get('/api/schedule/today', (req, res) => {
  res.json({ classes: getTodaySchedule() });
});

// ─── API: Deals ───
app.get('/api/deals', (req, res) => {
  res.json({ deals: DEALS });
});

// ─── API: Admin feed ───
app.get('/api/admin/feed', (req, res) => {
  const checkins = stmts.getTodayCheckins.all();
  const unclaimed = stmts.getUnclaimedRewards.all();
  res.json({ checkins, unclaimed_rewards: unclaimed });
});

// ─── API: Admin stats ───
app.get('/api/admin/stats', (req, res) => {
  const stats = stmts.getTodayStats.get();
  res.json(stats);
});

// ─── Admin: Reset data (dev only) ───
app.post('/api/admin/reset', (req, res) => {
  db.exec('DELETE FROM rewards; DELETE FROM visits; DELETE FROM members;');
  res.json({ success: true, message: 'All data cleared' });
});

// ─── Client reset (clears localStorage + DB, handy for testing) ───
app.get('/reset', (req, res) => {
  db.exec('DELETE FROM rewards; DELETE FROM visits; DELETE FROM members;');
  res.send(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width"><title>Reset</title></head>
    <body><script>localStorage.clear();window.location.href='/';</script></body></html>`);
});

// ─── Serve admin page ───
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ─── SPA fallback: serve index.html for all other routes ───
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`TapIn PWA running on port ${PORT}`);
});

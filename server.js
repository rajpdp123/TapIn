const express = require('express');
const path = require('path');
const { stmts, generateVerificationCode } = require('./db');
const { getTodaySchedule, findClassForCheckin } = require('./schedule');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Phone normalisation (E.164) ───
function normalizePhone(raw) {
  if (!raw) return null;
  let phone = raw.replace(/[\s\-\(\)]/g, '');
  // Handle 0-prefix German numbers
  if (phone.startsWith('0') && !phone.startsWith('00')) {
    phone = '+49' + phone.slice(1);
  }
  // Handle 49 without +
  if (phone.startsWith('49') && phone.length > 10) {
    phone = '+' + phone;
  }
  // Handle 0049
  if (phone.startsWith('00')) {
    phone = '+' + phone.slice(2);
  }
  // Ensure + prefix
  if (!phone.startsWith('+')) {
    phone = '+49' + phone;
  }
  return phone;
}

// Berlin date string for cooldown comparison
function berlinDateStr() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' });
}

// ─── API: Register ───
app.post('/api/register', (req, res) => {
  const phone = normalizePhone(req.body.phone);
  if (!phone) return res.status(400).json({ error: 'Phone number required' });

  let member = stmts.getMemberByPhone.get(phone);
  if (member) {
    return res.json({ member, existing: true });
  }

  member = stmts.createMember.get(phone);
  res.json({ member, existing: false });
});

// ─── API: Check-in ───
app.post('/api/checkin', (req, res) => {
  const phone = normalizePhone(req.body.phone);
  if (!phone) return res.status(400).json({ error: 'Phone number required' });

  let member = stmts.getMemberByPhone.get(phone);
  if (!member) {
    member = stmts.createMember.get(phone);
  }

  // Cooldown: one check-in per calendar day (Berlin time)
  const todayVisit = stmts.getTodayVisitForMember.get(member.id);
  if (todayVisit) {
    // Refresh member data
    member = stmts.getMemberByPhone.get(phone);
    const visits = stmts.getVisitsByMember.all(member.id);
    const rewards = stmts.getRewardsByMember.all(member.id);
    return res.json({
      member,
      visit: todayVisit,
      visits,
      rewards,
      already_checked_in: true,
      message: "You're already checked in today!",
    });
  }

  // Find class
  const { class_name, class_time } = findClassForCheckin();

  // Check if this visit earns a reward (visit will be the 10th stamp)
  const willEarnReward = member.current_stamp_count >= 9;

  // Increment visit
  stmts.updateMemberVisit.run(member.id);
  const visit = stmts.createVisit.get(member.id, class_name, class_time);

  // Create reward if 10th stamp
  let reward = null;
  if (willEarnReward) {
    const code = generateVerificationCode();
    reward = stmts.createReward.get(member.id, code);
  }

  // Refresh member data
  member = stmts.getMemberByPhone.get(phone);
  const visits = stmts.getVisitsByMember.all(member.id);
  const rewards = stmts.getRewardsByMember.all(member.id);

  res.json({
    member,
    visit,
    visits,
    rewards,
    reward_earned: !!reward,
    reward,
    already_checked_in: false,
    message: class_name
      ? `Checked in for ${class_name} at ${class_time}!`
      : 'Checked in successfully!',
  });
});

// ─── API: Get member ───
app.get('/api/member/:phone', (req, res) => {
  const phone = normalizePhone(req.params.phone);
  if (!phone) return res.status(400).json({ error: 'Phone number required' });

  const member = stmts.getMemberByPhone.get(phone);
  if (!member) return res.status(404).json({ error: 'Member not found' });

  const visits = stmts.getVisitsByMember.all(member.id);
  const rewards = stmts.getRewardsByMember.all(member.id);

  res.json({ member, visits, rewards });
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

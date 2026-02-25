const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, 'tapin.db');
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read/write
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Migrations ───
db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE NOT NULL,
    name TEXT,
    email TEXT,
    visit_count INTEGER DEFAULT 0,
    current_stamp_count INTEGER DEFAULT 0,
    total_rewards_claimed INTEGER DEFAULT 0,
    source TEXT DEFAULT 'nfc',
    match_status TEXT DEFAULT 'unmatched',
    mindbody_client_id TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL REFERENCES members(id),
    checked_in_at TEXT DEFAULT (datetime('now')),
    class_name TEXT,
    class_time TEXT
  );

  CREATE TABLE IF NOT EXISTS rewards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL REFERENCES members(id),
    earned_at TEXT DEFAULT (datetime('now')),
    claimed_at TEXT,
    reward_type TEXT DEFAULT 'free_class',
    status TEXT DEFAULT 'unclaimed',
    verification_code TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_members_phone ON members(phone);
  CREATE INDEX IF NOT EXISTS idx_visits_member ON visits(member_id);
  CREATE INDEX IF NOT EXISTS idx_visits_date ON visits(checked_in_at);
  CREATE INDEX IF NOT EXISTS idx_rewards_member ON rewards(member_id);
`);

// ─── Prepared statements ───
const stmts = {
  getMemberByPhone: db.prepare('SELECT * FROM members WHERE phone = ?'),

  createMember: db.prepare(`
    INSERT INTO members (phone) VALUES (?)
    RETURNING *
  `),

  updateMemberVisit: db.prepare(`
    UPDATE members
    SET visit_count = visit_count + 1,
        current_stamp_count = CASE WHEN current_stamp_count >= 9 THEN 0 ELSE current_stamp_count + 1 END,
        updated_at = datetime('now')
    WHERE id = ?
  `),

  updateMemberProfile: db.prepare(`
    UPDATE members SET name = ?, email = ?, updated_at = datetime('now')
    WHERE phone = ?
  `),

  createVisit: db.prepare(`
    INSERT INTO visits (member_id, class_name, class_time)
    VALUES (?, ?, ?)
    RETURNING *
  `),

  getVisitsByMember: db.prepare(`
    SELECT * FROM visits WHERE member_id = ? ORDER BY checked_in_at DESC
  `),

  getTodayVisitForMember: db.prepare(`
    SELECT * FROM visits
    WHERE member_id = ?
      AND date(checked_in_at) = date('now')
    ORDER BY checked_in_at DESC
    LIMIT 1
  `),

  createReward: db.prepare(`
    INSERT INTO rewards (member_id, verification_code)
    VALUES (?, ?)
    RETURNING *
  `),

  getRewardsByMember: db.prepare(`
    SELECT * FROM rewards WHERE member_id = ? ORDER BY earned_at DESC
  `),

  claimReward: db.prepare(`
    UPDATE rewards
    SET status = 'claimed', claimed_at = datetime('now')
    WHERE id = ? AND status = 'unclaimed'
  `),

  getRewardById: db.prepare('SELECT * FROM rewards WHERE id = ?'),

  incrementRewardsClaimed: db.prepare(`
    UPDATE members SET total_rewards_claimed = total_rewards_claimed + 1, updated_at = datetime('now')
    WHERE id = ?
  `),

  // Admin queries
  getTodayCheckins: db.prepare(`
    SELECT v.*, m.phone, m.name, m.current_stamp_count, m.visit_count,
           r.verification_code as reward_code, r.status as reward_status
    FROM visits v
    JOIN members m ON v.member_id = m.id
    LEFT JOIN rewards r ON r.member_id = m.id
      AND date(r.earned_at) = date('now')
    WHERE date(v.checked_in_at) = date('now')
    ORDER BY v.checked_in_at DESC
  `),

  getTodayStats: db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM visits WHERE date(checked_in_at) = date('now')) as total_checkins,
      (SELECT COUNT(DISTINCT member_id) FROM visits WHERE date(checked_in_at) = date('now')) as unique_members,
      (SELECT COUNT(*) FROM rewards WHERE date(earned_at) = date('now')) as rewards_earned,
      (SELECT COUNT(*) FROM members) as total_members
  `),

  getUnclaimedRewards: db.prepare(`
    SELECT r.*, m.phone, m.name
    FROM rewards r
    JOIN members m ON r.member_id = m.id
    WHERE r.status = 'unclaimed'
    ORDER BY r.earned_at DESC
  `),
};

function generateVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

module.exports = { db, stmts, generateVerificationCode };

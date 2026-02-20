import { useState } from "react";

// ─── Wire palette (greyscale — no branding yet) ───
const W = {
  bg: "#F5F5F5", card: "#FFFFFF", border: "#DDDDDD",
  text: "#333333", light: "#999999", filled: "#BBBBBB",
  empty: "#EEEEEE", darkBg: "#E8E8E8",
};
const font = "'Inter', system-ui, sans-serif";
const HOME = "#557799";

// ─── Reusable Components ───

function Phone({ children, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{
        padding: "3px 10px", borderRadius: 6, fontSize: 9, fontWeight: 700,
        fontFamily: font, letterSpacing: 0.8, textTransform: "uppercase",
        background: HOME, color: "#fff",
      }}>Home</div>
      <div style={{
        width: 320, height: 660, borderRadius: 36, border: `2px solid ${W.border}`,
        background: W.bg, overflow: "hidden", boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
      }}>
        <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${W.border}` }}>
          <div style={{ width: 80, height: 6, borderRadius: 3, background: W.border }} />
        </div>
        <div style={{ height: 616, overflowY: "auto" }}>{children}</div>
      </div>
      <div style={{ fontSize: 11, color: HOME, fontFamily: font, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2 }}>
        {label}
      </div>
    </div>
  );
}

function MiniStampGrid({ filled, total = 10 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 3 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          width: 18, height: 18, borderRadius: 4,
          border: `1px solid ${i < filled ? W.filled : W.border}`,
          background: i < filled ? W.filled : W.empty,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 7, fontFamily: font,
          color: i < filled ? W.card : W.light, fontWeight: 700,
        }}>
          {i < filled ? "✓" : ""}
        </div>
      ))}
    </div>
  );
}

// ─── Schedule data ───
const schedule = [
  { time: "07:00", class: "Morning Flow Pilates", teacher: "Tara", spots: 3 },
  { time: "09:30", class: "Reformer Basics", teacher: "Elena", spots: 1 },
  { time: "12:00", class: "Power Mat", teacher: "Petra", spots: 5 },
  { time: "17:30", class: "Barre Sculpt", teacher: "Maia", spots: 2 },
  { time: "19:00", class: "Stretch & Restore", teacher: "Tara", spots: 7 },
];

// ─── Deals data ───
const deals = [
  { emoji: "☕", title: "Early Bird Perk", desc: "5 morning classes → 1 free coffee at Companion Coffee", tag: "Popular" },
  { emoji: "🧘", title: "Bring a Friend", desc: "Bring a friend to 3 classes → both get 1 free class", tag: "New" },
  { emoji: "🎒", title: "Weekend Warrior", desc: "4 weekend classes in a month → 20% off GMS merch", tag: null },
  { emoji: "✨", title: "Consistency Bonus", desc: "3 classes per week for a month → free mat rental for a month", tag: null },
];

// ─── Profile field config ───
// "filled" = data we already have from Journey 1 & 3
// "empty" = data user can add themselves
const profileFields = [
  { label: "Phone", value: "+49 170 •••• 89", filled: true, icon: "📱" },
  { label: "Name", value: "", filled: false, icon: "👤", placeholder: "Add your name" },
  { label: "Email", value: "", filled: false, icon: "✉", placeholder: "Add your email" },
  { label: "Birthday", value: "", filled: false, icon: "🎂", placeholder: "Add for a birthday surprise" },
  { label: "Preferred class", value: "", filled: false, icon: "🧘", placeholder: "e.g. Morning Flow, Barre" },
];

// ═══════════════════════════════════════════════════
// PROFILE SCREEN
// ═══════════════════════════════════════════════════

function ProfileScreen({ onBack }) {
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>

      {/* ── Back nav ── */}
      <div
        onClick={onBack}
        style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
      >
        <span style={{ fontSize: 14, color: W.text }}>←</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: W.text, fontFamily: font }}>Back</span>
      </div>

      {/* ── Profile header ── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingTop: 4 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: W.filled, border: `2px solid ${W.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, color: W.card,
        }}>👤</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: W.text, fontFamily: font }}>Your Profile</div>
          <div style={{ fontSize: 10, color: W.light, fontFamily: font, marginTop: 2 }}>
            Complete your info for a personalised experience
          </div>
        </div>
      </div>

      {/* ── Completion indicator ── */}
      <div style={{
        width: "100%", padding: "8px 12px", borderRadius: 8,
        background: W.darkBg, display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: 5, borderRadius: 3, background: W.empty }}>
            <div style={{ height: "100%", borderRadius: 3, background: W.filled, width: "20%" }} />
          </div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 600, color: W.text, fontFamily: font }}>1/5</span>
      </div>

      {/* ── Profile fields ── */}
      <div style={{
        width: "100%", borderRadius: 14,
        border: `1.5px solid ${W.border}`, background: W.card,
        overflow: "hidden",
      }}>
        {profileFields.map((f, i) => (
          <div key={i} style={{
            padding: "12px 14px",
            borderBottom: i < profileFields.length - 1 ? `1px solid ${W.empty}` : "none",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>{f.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: W.light, fontFamily: font, textTransform: "uppercase", letterSpacing: 0.8 }}>
                {f.label}
              </div>
              {f.filled ? (
                <div style={{ fontSize: 12, fontWeight: 600, color: W.text, fontFamily: font, marginTop: 2 }}>
                  {f.value}
                </div>
              ) : (
                <div style={{ fontSize: 11, color: W.border, fontFamily: font, marginTop: 2, fontStyle: "italic" }}>
                  {f.placeholder}
                </div>
              )}
            </div>
            {f.filled ? (
              <div style={{
                width: 20, height: 20, borderRadius: "50%",
                background: W.filled, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 10, color: W.card, flexShrink: 0,
              }}>✓</div>
            ) : (
              <span style={{ fontSize: 10, color: HOME, fontWeight: 600, fontFamily: font, flexShrink: 0 }}>Add →</span>
            )}
          </div>
        ))}
      </div>

      {/* ── Data note ── */}
      <div style={{
        width: "100%", padding: 12, borderRadius: 10,
        background: W.darkBg, border: `1px solid ${W.border}`,
      }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: W.text, fontFamily: font, marginBottom: 4 }}>
          Why we ask
        </div>
        <div style={{ fontSize: 10, color: W.light, fontFamily: font, lineHeight: 1.5 }}>
          Your name and email help us link your visits to Mindbody so you can earn rewards. Birthday lets us surprise you. We never share your data.
        </div>
      </div>

      {/* ── GDPR / Delete ── */}
      <div style={{
        width: "100%", padding: 12, borderRadius: 10,
        border: `1px solid ${W.border}`, background: W.card,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 10, color: W.light, fontFamily: font, lineHeight: 1.5 }}>
          Only a hashed phone number is stored. To delete your data, text <strong>DELETE</strong> to the studio.
        </div>
      </div>

      <div style={{ height: 10 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════
// HOME SCREEN
// ═══════════════════════════════════════════════════

function HomeScreen({ visits, onProfileClick }) {
  const progressMsg = visits < 3
    ? "You're just getting started!"
    : visits < 6
    ? "Nice momentum — keep going!"
    : visits < 9
    ? "Almost there — the free class is close!"
    : "One more visit to your free class!";

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>

      {/* ── Header / Greeting ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 10, color: W.light, fontFamily: font }}>Welcome back</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: W.text, fontFamily: font }}>Good Moves</div>
        </div>
        {/* Profile avatar — clickable */}
        <div
          onClick={onProfileClick}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: W.filled, border: `2px solid ${W.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, color: W.card, cursor: "pointer",
            position: "relative",
          }}
        >
          👤
          {/* incomplete profile dot */}
          <div style={{
            position: "absolute", top: -1, right: -1,
            width: 10, height: 10, borderRadius: "50%",
            background: "#DD6644", border: `2px solid ${W.bg}`,
          }} />
        </div>
      </div>

      {/* ── Progress Card (mini stamp card) ── */}
      <div style={{
        width: "100%", padding: 14, borderRadius: 14,
        border: `1.5px solid ${W.border}`, background: W.card,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: W.text, fontFamily: font }}>
            Your Progress
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: W.light, fontFamily: font }}>
            {visits}/10
          </span>
        </div>

        <MiniStampGrid filled={visits} />

        {/* Progress bar */}
        <div style={{ height: 5, borderRadius: 3, background: W.empty, marginTop: 8 }}>
          <div style={{ height: "100%", borderRadius: 3, background: W.filled, width: `${(visits / 10) * 100}%` }} />
        </div>

        <div style={{ fontSize: 10, color: W.light, fontFamily: font, marginTop: 6 }}>
          {progressMsg}
        </div>

        {/* Reward preview */}
        <div style={{
          marginTop: 8, padding: "6px 10px", borderRadius: 8,
          background: W.darkBg, display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 12 }}>🎁</span>
          <span style={{ fontSize: 10, color: W.text, fontFamily: font }}>
            <strong>Reward:</strong> Free class at visit 10
          </span>
        </div>
      </div>

      {/* ── Today's Schedule ── */}
      <div style={{
        width: "100%", padding: 14, borderRadius: 14,
        border: `1.5px solid ${W.border}`, background: W.card,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: W.text, fontFamily: font }}>
            Today's Classes
          </span>
          <span style={{ fontSize: 9, color: HOME, fontFamily: font, fontWeight: 600 }}>
            View all →
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {schedule.map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px", borderRadius: 10,
              background: i === 0 ? W.darkBg : "transparent",
              border: i === 0 ? `1px solid ${W.border}` : "none",
            }}>
              <div style={{
                width: 38, textAlign: "center", fontSize: 11, fontWeight: 700,
                color: W.text, fontFamily: font, flexShrink: 0,
              }}>{s.time}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: W.text, fontFamily: font, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.class}
                </div>
                <div style={{ fontSize: 9, color: W.light, fontFamily: font }}>
                  {s.teacher} · {s.spots} spot{s.spots !== 1 ? "s" : ""} left
                </div>
              </div>
              <div style={{
                padding: "4px 8px", borderRadius: 6,
                border: `1px solid ${W.border}`, background: W.bg,
                fontSize: 9, fontWeight: 600, color: W.text, fontFamily: font,
                flexShrink: 0,
              }}>Book</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Deals & Perks ── */}
      <div style={{
        width: "100%", padding: 14, borderRadius: 14,
        border: `1.5px solid ${W.border}`, background: W.card,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: W.text, fontFamily: font }}>
            Deals & Perks
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {deals.map((d, i) => (
            <div key={i} style={{
              padding: "10px 12px", borderRadius: 10,
              border: `1px solid ${W.border}`, background: W.bg,
              display: "flex", gap: 10, alignItems: "flex-start",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: W.card, border: `1px solid ${W.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, flexShrink: 0,
              }}>{d.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: W.text, fontFamily: font }}>
                    {d.title}
                  </span>
                  {d.tag && (
                    <span style={{
                      fontSize: 8, fontWeight: 700, color: HOME,
                      background: "#E8EEF4", padding: "1px 5px",
                      borderRadius: 4, fontFamily: font, textTransform: "uppercase",
                    }}>{d.tag}</span>
                  )}
                </div>
                <div style={{ fontSize: 10, color: W.light, fontFamily: font, marginTop: 2, lineHeight: 1.4 }}>
                  {d.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 10 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN LAYOUT — with screen toggle
// ═══════════════════════════════════════════════════

export default function HomeWireframe() {
  const [visits, setVisits] = useState(4);
  const [screen, setScreen] = useState("home"); // "home" | "profile"

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", padding: "40px 20px", fontFamily: font }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: W.text, margin: "0 0 6px" }}>
          TapIn — {screen === "home" ? "Home Screen" : "User Profile"}
        </h1>
        <p style={{ fontSize: 13, color: W.light, margin: "0 0 4px" }}>
          Step 3 · Lo-fi wireframe · Click the avatar to toggle
        </p>
      </div>

      {/* Visit selector — only show on home */}
      {screen === "home" && (
        <div style={{
          maxWidth: 400, margin: "0 auto 24px", padding: 14, borderRadius: 12,
          background: W.card, border: `1px solid ${W.border}`, textAlign: "center",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: W.text, fontFamily: font, marginBottom: 8 }}>
            Preview with different visit counts
          </div>
          <div style={{ display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap" }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(v => (
              <button
                key={v}
                onClick={() => setVisits(v)}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: `1.5px solid ${visits === v ? W.text : W.border}`,
                  background: visits === v ? W.text : W.card,
                  color: visits === v ? W.card : W.text,
                  fontSize: 12, fontWeight: 700, fontFamily: font,
                  cursor: "pointer",
                }}
              >{v}</button>
            ))}
          </div>
        </div>
      )}

      {/* Phone */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Phone label={screen === "home" ? "Home · Dashboard" : "User Profile"}>
          {screen === "home" ? (
            <HomeScreen visits={visits} onProfileClick={() => setScreen("profile")} />
          ) : (
            <ProfileScreen onBack={() => setScreen("home")} />
          )}
        </Phone>
      </div>

      {/* ── Design Notes ── */}
      <div style={{
        maxWidth: 640, margin: "48px auto 0", padding: 20, background: W.card,
        borderRadius: 12, border: `1px solid ${W.border}`,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: W.text, fontFamily: font, marginBottom: 12 }}>
          Home + Profile · Design Notes
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { section: "Progress", desc: "Mini stamp card (10 dots in a row) with progress bar, motivational message that changes per visit count, and reward preview. First thing customers see." },
            { section: "Schedule", desc: "Today's classes with time, name, teacher, spots remaining, and a Book button. First class highlighted. 'View all' for full schedule." },
            { section: "Deals", desc: "Perks and partner deals that reward behaviour — mornings, friends, weekends. Mini loyalty loops beyond the core stamp card." },
            { section: "Profile", desc: "Accessible via avatar (top-right). Shows data we already have (phone from J1) and lets users add name, email, birthday, preferred class. Completion bar nudges users to fill in more." },
          ].map(item => (
            <div key={item.section} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{
                padding: "2px 7px", borderRadius: 4, flexShrink: 0,
                background: HOME, fontSize: 9, fontWeight: 700,
                color: "#fff", fontFamily: font,
              }}>{item.section}</div>
              <div style={{ fontSize: 11, color: W.light, fontFamily: font, lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, padding: 10, borderRadius: 8, background: "#F8F8F8", border: `1px solid ${W.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: W.text, fontFamily: font, marginBottom: 4 }}>
            Design Decisions
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              "Profile avatar replaces logo — top-right is where users expect account access",
              "Orange dot on avatar — signals incomplete profile, nudges without nagging",
              "Phone is pre-filled from Journey 1 — user sees value of data they already gave",
              "Name + email can be added early — if filled here, Journey 3 can skip those fields at redemption",
              "Birthday is a soft upsell — 'Add for a birthday surprise' creates curiosity",
              "Completion bar (1/5) — gamifies profile completion, same psychology as the stamp card",
              "'Why we ask' section — builds trust, explains the Mindbody link, promises no spam",
              "GDPR delete via text DELETE — simple, memorable, no extra UI needed",
            ].map((d, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                <span style={{ fontSize: 9, color: HOME, fontFamily: font, marginTop: 1 }}>●</span>
                <span style={{ fontSize: 11, color: W.light, fontFamily: font, lineHeight: 1.5 }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

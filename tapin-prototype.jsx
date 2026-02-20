import { useState, useEffect, useRef } from "react";

const COLORS = {
  terracotta: "#B0482D",
  beige: "#EEDBC3",
  blue: "#001DA2",
  lightBg: "#FBF6F1",
  text: "#000044",
  white: "#FFFFFF",
};

const fontStack = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

// Shared styles
const pill = {
  display: "inline-block",
  padding: "6px 14px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  fontFamily: fontStack,
};

const btn = (bg, color) => ({
  width: "100%",
  padding: "16px 0",
  border: "none",
  borderRadius: 16,
  background: bg,
  color: color,
  fontSize: 17,
  fontWeight: 700,
  fontFamily: fontStack,
  cursor: "pointer",
  letterSpacing: 0.3,
  transition: "transform 0.1s, opacity 0.15s",
});

// ─── Phone Frame ────────────────────────────────────
function PhoneFrame({ children }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: COLORS.beige, fontFamily: fontStack }}>
      <div style={{ width: 390, height: 844, borderRadius: 44, overflow: "hidden", background: COLORS.lightBg, boxShadow: "0 25px 80px rgba(0,0,68,0.15)", position: "relative", border: `3px solid ${COLORS.text}` }}>
        {/* Notch */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 160, height: 34, background: COLORS.text, borderRadius: "0 0 22px 22px", zIndex: 10 }} />
        <div style={{ height: "100%", overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Screen 1: Splash ───────────────────────────────
function SplashScreen({ onDone }) {
  const [scale, setScale] = useState(0.3);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setTimeout(() => { setScale(1); setOpacity(1); }, 100);
    setTimeout(onDone, 2000);
  }, []);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: COLORS.terracotta, position: "relative", overflow: "hidden" }}>
      {/* Blob shapes */}
      <div style={{ position: "absolute", top: -60, right: -80, width: 260, height: 260, borderRadius: "50% 40% 50% 60%", background: "rgba(238,219,195,0.15)" }} />
      <div style={{ position: "absolute", bottom: -40, left: -60, width: 200, height: 200, borderRadius: "60% 50% 40% 50%", background: "rgba(238,219,195,0.1)" }} />

      <div style={{ transform: `scale(${scale})`, opacity, transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
        <div style={{ fontSize: 52, fontWeight: 900, color: COLORS.beige, letterSpacing: -1, fontFamily: fontStack, textAlign: "center", lineHeight: 1.1 }}>
          TAP<span style={{ color: COLORS.lightBg }}>IN</span>
        </div>
        <div style={{ fontSize: 11, color: "rgba(238,219,195,0.7)", textAlign: "center", marginTop: 8, letterSpacing: 3, textTransform: "uppercase", fontFamily: fontStack }}>
          by Good Moves
        </div>
      </div>

      {/* Loading ring */}
      <div style={{ marginTop: 40, width: 28, height: 28, border: "3px solid rgba(238,219,195,0.2)", borderTopColor: COLORS.beige, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Screen 2: Phone Entry ──────────────────────────
function PhoneEntryScreen({ onSubmit }) {
  const [phone, setPhone] = useState("");
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: COLORS.lightBg }}>
      <div style={{ flex: 1, padding: "80px 28px 28px" }}>
        {/* Studio badge */}
        <div style={{ ...pill, background: COLORS.beige, color: COLORS.terracotta, marginBottom: 24 }}>
          Good Moves Pilates Studio
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 800, color: COLORS.text, margin: "0 0 8px", lineHeight: 1.2, fontFamily: fontStack }}>
          Hey Good Mover!
        </h1>
        <p style={{ fontSize: 16, color: "#666680", margin: "0 0 36px", lineHeight: 1.5, fontFamily: fontStack }}>
          Enter your number to start collecting visits. Your 10th class is on us.
        </p>

        {/* Phone input */}
        <div style={{ background: COLORS.white, borderRadius: 16, padding: "4px 4px 4px 20px", display: "flex", alignItems: "center", border: `2px solid ${phone.length > 3 ? COLORS.terracotta : COLORS.beige}`, transition: "border-color 0.2s" }}>
          <span style={{ fontSize: 18, color: COLORS.text, fontFamily: fontStack, marginRight: 8 }}>🇩🇪 +49</span>
          <input
            ref={inputRef}
            type="tel"
            placeholder="170 123 4567"
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/[^0-9 ]/g, "").slice(0, 14))}
            style={{ flex: 1, border: "none", outline: "none", fontSize: 18, padding: "16px 0", fontFamily: fontStack, color: COLORS.text, background: "transparent" }}
          />
          {phone.length > 5 && (
            <button
              onClick={() => onSubmit(phone)}
              style={{ background: COLORS.terracotta, border: "none", borderRadius: 12, padding: "12px 18px", cursor: "pointer", transition: "transform 0.1s" }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.95)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <span style={{ color: COLORS.white, fontSize: 18 }}>→</span>
            </button>
          )}
        </div>

        <p style={{ fontSize: 12, color: "#999", marginTop: 12, fontFamily: fontStack }}>
          We only store your phone number. No spam, ever.
        </p>
      </div>

      {/* Bottom blob decoration */}
      <div style={{ position: "relative", height: 120 }}>
        <div style={{ position: "absolute", bottom: -30, left: -40, width: 200, height: 140, borderRadius: "50% 60% 40% 50%", background: COLORS.beige, opacity: 0.5 }} />
        <div style={{ position: "absolute", bottom: -20, right: -30, width: 160, height: 120, borderRadius: "40% 50% 60% 50%", background: COLORS.terracotta, opacity: 0.1 }} />
      </div>
    </div>
  );
}

// ─── Screen 3: Check-In Confirmation ────────────────
function CheckInScreen({ visitCount, onContinue, isReward }) {
  const [showCheck, setShowCheck] = useState(false);
  const [showStamps, setShowStamps] = useState(false);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    setTimeout(() => setShowCheck(true), 300);
    setTimeout(() => setShowStamps(true), 700);
    if (isReward) {
      setTimeout(() => {
        setConfetti(Array.from({ length: 30 }, (_, i) => ({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 0.5,
          color: [COLORS.terracotta, COLORS.blue, COLORS.beige, "#FFD700"][Math.floor(Math.random() * 4)],
          size: 6 + Math.random() * 8,
        })));
      }, 500);
    }
  }, []);

  const totalStamps = 10;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: isReward ? COLORS.terracotta : COLORS.lightBg, position: "relative", overflow: "hidden" }}>
      {/* Confetti */}
      {confetti.map(c => (
        <div key={c.id} style={{
          position: "absolute", top: -20, left: `${c.left}%`, width: c.size, height: c.size,
          background: c.color, borderRadius: c.size > 10 ? "50%" : "2px",
          animation: `fall 2s ${c.delay}s ease-in forwards`, zIndex: 5,
        }} />
      ))}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 28px 28px", zIndex: 6 }}>
        {/* Check circle */}
        <div style={{
          width: 100, height: 100, borderRadius: "50%",
          background: isReward ? COLORS.beige : COLORS.terracotta,
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: showCheck ? "scale(1)" : "scale(0)",
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
          <span style={{ fontSize: 48, color: isReward ? COLORS.terracotta : COLORS.white }}>
            {isReward ? "🎉" : "✓"}
          </span>
        </div>

        <h1 style={{
          fontSize: isReward ? 28 : 26, fontWeight: 800, textAlign: "center", margin: "24px 0 8px",
          color: isReward ? COLORS.beige : COLORS.text, fontFamily: fontStack,
          opacity: showCheck ? 1 : 0, transition: "opacity 0.4s 0.2s",
        }}>
          {isReward ? "You earned a free class!" : "You're checked in!"}
        </h1>

        <p style={{
          fontSize: 15, textAlign: "center", margin: "0 0 32px",
          color: isReward ? "rgba(238,219,195,0.8)" : "#666680", fontFamily: fontStack,
          opacity: showCheck ? 1 : 0, transition: "opacity 0.4s 0.3s",
        }}>
          {isReward
            ? "10 visits completed — you're amazing. Show this screen at reception to redeem."
            : `Visit ${visitCount} of ${totalStamps}. Keep moving!`
          }
        </p>

        {/* Stamp card */}
        <div style={{
          background: isReward ? "rgba(238,219,195,0.15)" : COLORS.white,
          borderRadius: 20, padding: 24, width: "100%",
          border: `2px solid ${isReward ? "rgba(238,219,195,0.2)" : COLORS.beige}`,
          opacity: showStamps ? 1 : 0, transform: showStamps ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.5s 0.4s",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: isReward ? COLORS.beige : COLORS.text, fontFamily: fontStack }}>
              YOUR PROGRESS
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: isReward ? COLORS.beige : COLORS.terracotta, fontFamily: fontStack }}>
              {visitCount}/{totalStamps}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
            {Array.from({ length: totalStamps }, (_, i) => {
              const filled = i < visitCount;
              const isLatest = i === visitCount - 1;
              return (
                <div key={i} style={{
                  aspectRatio: "1", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                  background: filled ? COLORS.terracotta : (isReward ? "rgba(238,219,195,0.1)" : COLORS.lightBg),
                  border: `2px solid ${filled ? COLORS.terracotta : (isReward ? "rgba(238,219,195,0.15)" : COLORS.beige)}`,
                  transform: isLatest ? "scale(1.1)" : "scale(1)",
                  boxShadow: isLatest ? `0 4px 12px rgba(176,72,45,0.3)` : "none",
                  transition: `all 0.3s ${0.5 + i * 0.05}s`,
                }}>
                  {filled ? (
                    <span style={{ color: COLORS.white, fontSize: 16, fontWeight: 700 }}>✓</span>
                  ) : (
                    <span style={{ color: isReward ? "rgba(238,219,195,0.3)" : "#ccc", fontSize: 12, fontWeight: 600, fontFamily: fontStack }}>
                      {i + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 16, height: 6, borderRadius: 3, background: isReward ? "rgba(238,219,195,0.15)" : COLORS.beige }}>
            <div style={{
              height: "100%", borderRadius: 3, background: isReward ? COLORS.beige : COLORS.terracotta,
              width: showStamps ? `${(visitCount / totalStamps) * 100}%` : "0%",
              transition: "width 0.8s 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }} />
          </div>
        </div>

        {isReward && (
          <button
            onClick={onContinue}
            style={{ ...btn(COLORS.beige, COLORS.terracotta), marginTop: 24, opacity: showStamps ? 1 : 0, transition: "opacity 0.4s 1s" }}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          >
            Redeem Free Class
          </button>
        )}
      </div>

      {!isReward && (
        <div style={{ padding: "0 28px 48px" }}>
          <button
            onClick={onContinue}
            style={btn(COLORS.terracotta, COLORS.white)}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          >
            Done
          </button>
        </div>
      )}

      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(900px) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Screen 4: Owner Dashboard ──────────────────────
function DashboardScreen({ onBack }) {
  const stats = [
    { label: "Today's Check-ins", value: "23", icon: "📍" },
    { label: "Active Members", value: "147", icon: "👥" },
    { label: "Rewards Redeemed", value: "8", icon: "🎁" },
  ];

  const recentVisits = [
    { name: "Maria S.", time: "2 min ago", visit: 7 },
    { name: "Jonas K.", time: "15 min ago", visit: 3 },
    { name: "Priya M.", time: "28 min ago", visit: 10, reward: true },
    { name: "Lena B.", time: "1 hr ago", visit: 5 },
    { name: "Tom W.", time: "1 hr ago", visit: 1, isNew: true },
  ];

  return (
    <div style={{ minHeight: "100%", background: COLORS.lightBg }}>
      {/* Header */}
      <div style={{ background: COLORS.text, padding: "60px 24px 24px", borderRadius: "0 0 28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 13, color: "rgba(238,219,195,0.6)", margin: 0, fontFamily: fontStack }}>STUDIO DASHBOARD</p>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: COLORS.beige, margin: "4px 0 0", fontFamily: fontStack }}>Good Moves</h1>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: COLORS.terracotta, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            🏠
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 24px 40px" }}>
        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: COLORS.white, borderRadius: 16, padding: "16px 12px", textAlign: "center", border: `1.5px solid ${COLORS.beige}` }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.text, fontFamily: fontStack }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "#888", fontFamily: fontStack, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent visits */}
        <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, margin: "0 0 12px", fontFamily: fontStack }}>Recent Check-ins</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {recentVisits.map((v, i) => (
            <div key={i} style={{
              background: COLORS.white, borderRadius: 14, padding: "14px 16px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              border: `1.5px solid ${v.reward ? COLORS.terracotta : COLORS.beige}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12,
                  background: v.reward ? COLORS.terracotta : (v.isNew ? COLORS.blue : COLORS.beige),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700, color: v.reward || v.isNew ? COLORS.white : COLORS.text, fontFamily: fontStack,
                }}>
                  {v.reward ? "🎉" : v.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, fontFamily: fontStack }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: "#999", fontFamily: fontStack }}>{v.time}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                {v.reward ? (
                  <span style={{ ...pill, background: COLORS.terracotta, color: COLORS.white, fontSize: 10 }}>FREE CLASS</span>
                ) : v.isNew ? (
                  <span style={{ ...pill, background: COLORS.blue, color: COLORS.white, fontSize: 10 }}>NEW</span>
                ) : (
                  <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.terracotta, fontFamily: fontStack }}>
                    Visit {v.visit}/10
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onBack}
          style={{ ...btn(COLORS.text, COLORS.beige), marginTop: 24 }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        >
          ← Back to Customer View
        </button>
      </div>
    </div>
  );
}

// ─── Nav Bar ────────────────────────────────────────
function NavBar({ screen, onNav }) {
  if (screen === "splash") return null;
  const items = [
    { id: "phone", label: "New User", icon: "👤" },
    { id: "checkin", label: "Check-in", icon: "✓" },
    { id: "reward", label: "Reward", icon: "🎁" },
    { id: "dashboard", label: "Studio", icon: "📊" },
  ];
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20,
      background: "rgba(251,246,241,0.95)", backdropFilter: "blur(10px)",
      borderTop: `1px solid ${COLORS.beige}`, padding: "8px 12px 24px",
      display: "flex", justifyContent: "space-around",
    }}>
      {items.map(item => {
        const active = screen === item.id || (screen === "checkin-4" && item.id === "checkin") || (screen === "checkin-10" && item.id === "reward");
        return (
          <button key={item.id} onClick={() => onNav(item.id)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 8px" }}>
            <span style={{ fontSize: 18, opacity: active ? 1 : 0.4 }}>{item.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: active ? COLORS.terracotta : "#999", fontFamily: fontStack }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main App ───────────────────────────────────────
export default function TapInPrototype() {
  const [screen, setScreen] = useState("splash");

  const handleNav = (id) => {
    if (id === "phone") setScreen("phone");
    else if (id === "checkin") setScreen("checkin-4");
    else if (id === "reward") setScreen("checkin-10");
    else if (id === "dashboard") setScreen("dashboard");
  };

  return (
    <PhoneFrame>
      <div style={{ position: "relative", height: "100%" }}>
        {screen === "splash" && <SplashScreen onDone={() => setScreen("phone")} />}
        {screen === "phone" && <PhoneEntryScreen onSubmit={() => setScreen("checkin-4")} />}
        {screen === "checkin-4" && <CheckInScreen visitCount={4} onContinue={() => setScreen("checkin-10")} />}
        {screen === "checkin-10" && <CheckInScreen visitCount={10} isReward onContinue={() => setScreen("dashboard")} />}
        {screen === "dashboard" && <DashboardScreen onBack={() => setScreen("splash")} />}
        <NavBar screen={screen} onNav={handleNav} />
      </div>
    </PhoneFrame>
  );
}

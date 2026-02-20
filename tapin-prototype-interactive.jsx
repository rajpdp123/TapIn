import { useState, useEffect, useRef } from "react";

// ─── Wire palette (greyscale — branding comes in Step 5) ───
const W = {
  bg: "#F5F5F5", card: "#FFFFFF", border: "#DDDDDD",
  text: "#333333", light: "#999999", filled: "#BBBBBB",
  empty: "#EEEEEE", darkBg: "#E8E8E8", accent: "#888888",
};
const font = "'Inter', system-ui, sans-serif";

// ─── Screens ───
const SCREENS = {
  SPLASH: "splash",
  PHONE: "phone",
  CHECKIN_1: "checkin_1",
  INSTANT_7: "instant_7",
  REWARD: "reward",
  CONFIRMED: "confirmed",
};

// ─── Reusable Components ───

function StampGrid({ filled, total = 10, animate = false, highlightLast = false }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
      {Array.from({ length: total }, (_, i) => {
        const isFilled = i < filled;
        const isLatest = highlightLast && i === filled - 1;
        return (
          <div key={i} style={{
            aspectRatio: "1", borderRadius: 8,
            border: `1.5px solid ${isFilled ? W.filled : W.border}`,
            background: isFilled ? W.filled : W.empty,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontFamily: font,
            color: isFilled ? W.card : W.light, fontWeight: 600,
            transform: isLatest ? "scale(1.15)" : "scale(1)",
            transition: animate ? `all 0.4s ease ${i * 0.06}s` : "none",
            boxShadow: isLatest ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
          }}>
            {isFilled ? "✓" : i + 1}
          </div>
        );
      })}
    </div>
  );
}

function ProgressBar({ value, max = 10, animate = false }) {
  return (
    <div style={{ height: 6, borderRadius: 3, background: W.empty, marginTop: 10, overflow: "hidden" }}>
      <div style={{
        height: "100%", borderRadius: 3, background: W.filled,
        width: `${(value / max) * 100}%`,
        transition: animate ? "width 0.8s ease" : "none",
      }} />
    </div>
  );
}

function WireButton({ children, bold, onClick, disabled }) {
  return (
    <div onClick={disabled ? undefined : onClick} style={{
      width: "100%", padding: "14px 0", borderRadius: 12,
      border: bold ? `2px solid ${W.text}` : `1.5px solid ${W.border}`,
      background: bold ? W.text : W.card,
      color: bold ? W.card : W.text,
      textAlign: "center", fontSize: 14,
      fontWeight: bold ? 700 : 600, fontFamily: font,
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "all 0.2s ease",
    }}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SCREEN: SPLASH
// ═══════════════════════════════════════════════════
function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 4;
      });
    }, 50);
    const timer = setTimeout(onComplete, 1500);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [onComplete]);

  return (
    <div style={{
      height: "100%", background: W.text, display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
    }}>
      <div style={{
        fontSize: 36, fontWeight: 900, color: W.card,
        fontFamily: font, letterSpacing: 4, textTransform: "uppercase",
      }}>
        TAPIN
      </div>
      <div style={{ fontSize: 11, color: W.light, fontFamily: font, letterSpacing: 2 }}>
        by Studio Name
      </div>
      <div style={{ width: 40, height: 40, marginTop: 12, position: "relative" }}>
        <svg viewBox="0 0 40 40" style={{ animation: "spin 1s linear infinite" }}>
          <circle cx="20" cy="20" r="16" fill="none" stroke={W.light} strokeWidth="2.5" opacity="0.3" />
          <circle cx="20" cy="20" r="16" fill="none" stroke={W.card} strokeWidth="2.5"
            strokeDasharray="80" strokeDashoffset={80 - progress * 0.8} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.1s ease" }} />
        </svg>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SCREEN: PHONE ENTRY (Journey 1)
// ═══════════════════════════════════════════════════
function PhoneEntryScreen({ onSubmit }) {
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
      <div style={{
        display: "inline-flex", alignSelf: "flex-start",
        padding: "4px 10px", borderRadius: 20,
        border: `1px solid ${W.border}`, fontSize: 10,
        color: W.light, fontFamily: font,
      }}>
        Studio Name
      </div>

      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: W.text, fontFamily: font, lineHeight: 1.2 }}>
          Welcome!
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: W.text, fontFamily: font, lineHeight: 1.2 }}>
          Enter your number
        </div>
      </div>

      <div style={{ fontSize: 12, color: W.light, fontFamily: font, lineHeight: 1.5 }}>
        We'll use this to track your visits. Your 10th class is free.
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "12px 14px", borderRadius: 10,
        border: `1.5px solid ${focused ? W.text : W.border}`,
        background: W.card, transition: "border-color 0.2s ease",
      }}>
        <span style={{ fontSize: 13, color: W.light, fontFamily: font }}>🇩🇪 +49</span>
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="176 1234 5678"
          style={{
            flex: 1, border: "none", outline: "none", fontSize: 15,
            fontFamily: font, color: W.text, background: "transparent",
          }}
        />
        <div
          onClick={() => phone.length >= 4 && onSubmit(phone)}
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: phone.length >= 4 ? W.text : W.empty,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, color: W.card, cursor: phone.length >= 4 ? "pointer" : "default",
            transition: "background 0.2s ease",
          }}
        >→</div>
      </div>

      <div style={{ fontSize: 9, color: W.light, fontFamily: font }}>
        We only store your phone number. No spam.
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: "flex", gap: 8, justifyContent: "center", opacity: 0.2 }}>
        <div style={{ width: 80, height: 60, borderRadius: "50% 40% 50% 60%", background: W.border }} />
        <div style={{ width: 60, height: 50, borderRadius: "40% 50% 60% 50%", background: W.border }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SCREEN: CHECK-IN CONFIRMATION (animated)
// ═══════════════════════════════════════════════════
function CheckinScreen({ visitNumber, onDone, isFirstTime }) {
  const [showCheck, setShowCheck] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [stampCount, setStampCount] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setShowCheck(true), 300);
    const t2 = setTimeout(() => setShowCard(true), 700);
    const t3 = setTimeout(() => setStampCount(visitNumber), 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [visitNumber]);

  const remaining = 10 - visitNumber;
  const messages = {
    1: "welcome!",
    2: "great start!",
    3: "you're on a roll!",
    4: "almost halfway!",
    5: "halfway there!",
    6: "keep it up!",
    7: "keep going!",
    8: "so close!",
    9: "one more to go!",
  };

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, height: "100%" }}>
      <div style={{ height: 12 }} />

      {!isFirstTime && (
        <div style={{
          padding: "4px 12px", borderRadius: 20,
          border: `1px solid ${W.border}`, fontSize: 10,
          color: W.light, fontFamily: font,
          opacity: showCheck ? 1 : 0, transition: "opacity 0.3s ease",
        }}>
          Welcome back — instant check-in
        </div>
      )}

      {/* Animated checkmark */}
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        border: `2px solid ${showCheck ? W.filled : W.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28, color: W.filled,
        transform: showCheck ? "scale(1)" : "scale(0.5)",
        opacity: showCheck ? 1 : 0,
        transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}>✓</div>

      <div style={{
        textAlign: "center",
        opacity: showCheck ? 1 : 0,
        transform: showCheck ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.4s ease 0.2s",
      }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: W.text, fontFamily: font }}>
          You're checked in!
        </div>
        <div style={{ fontSize: 13, color: W.light, fontFamily: font, marginTop: 4 }}>
          Visit {visitNumber} of 10 — {messages[visitNumber] || "keep going!"}
        </div>
      </div>

      {/* Stamp card with animation */}
      <div style={{
        width: "100%", padding: 16, borderRadius: 14,
        border: `1.5px solid ${W.border}`, background: W.card,
        opacity: showCard ? 1 : 0,
        transform: showCard ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.5s ease",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: W.light, fontFamily: font, textTransform: "uppercase", letterSpacing: 1 }}>
            Your Progress
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, color: W.text, fontFamily: font }}>
            {visitNumber}/10
          </span>
        </div>
        <StampGrid filled={stampCount} animate={true} highlightLast={true} />
        <ProgressBar value={stampCount} animate={true} />
      </div>

      <div style={{
        fontSize: 11, color: W.light, fontFamily: font,
        opacity: showCard ? 1 : 0, transition: "opacity 0.5s ease 0.5s",
      }}>
        {remaining > 0 ? `${remaining} more visit${remaining > 1 ? "s" : ""} to your free class!` : ""}
      </div>

      <div style={{ flex: 1 }} />
      <WireButton onClick={onDone}>Done</WireButton>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SCREEN: REWARD UNLOCKED (Journey 3)
// ═══════════════════════════════════════════════════
function RewardScreen({ onRedeem }) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showCredit, setShowCredit] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const t1 = setTimeout(() => setShowCelebration(true), 300);
    const t2 = setTimeout(() => setShowCard(true), 800);
    const t3 = setTimeout(() => setShowCredit(true), 1300);
    const t4 = setTimeout(() => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 1,
        size: 4 + Math.random() * 6,
        shade: ["#AAAAAA", "#CCCCCC", "#888888", "#DDDDDD", "#999999"][Math.floor(Math.random() * 5)],
      }));
      setParticles(newParticles);
    }, 400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <div style={{
      padding: 20, display: "flex", flexDirection: "column",
      alignItems: "center", gap: 14, height: "100%", background: W.darkBg,
      position: "relative", overflow: "hidden",
    }}>
      {/* Confetti particles */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute", top: -10, left: `${p.x}%`,
          width: p.size, height: p.size, borderRadius: 2,
          background: p.shade,
          animation: `confettiFall 2.5s ease-in ${p.delay}s forwards`,
        }} />
      ))}

      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(600px) rotate(720deg); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      <div style={{ height: 24 }} />

      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        border: `2px solid ${W.border}`, background: W.card,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 32,
        transform: showCelebration ? "scale(1)" : "scale(0)",
        opacity: showCelebration ? 1 : 0,
        transition: "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        animation: showCelebration ? "pulse 2s ease infinite 1s" : "none",
      }}>🎉</div>

      <div style={{
        textAlign: "center",
        opacity: showCelebration ? 1 : 0,
        transition: "opacity 0.4s ease 0.3s",
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: W.text, fontFamily: font }}>
          Free class earned!
        </div>
        <div style={{ fontSize: 12, color: W.light, fontFamily: font, marginTop: 4, lineHeight: 1.5 }}>
          10 visits completed — you're amazing.
        </div>
      </div>

      <div style={{
        width: "100%", padding: 16, borderRadius: 14,
        border: `1.5px solid ${W.border}`, background: W.card,
        opacity: showCard ? 1 : 0,
        transform: showCard ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.5s ease",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: W.light, fontFamily: font, textTransform: "uppercase", letterSpacing: 1 }}>
            Complete!
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, color: W.text, fontFamily: font }}>10/10</span>
        </div>
        <StampGrid filled={10} animate={true} />
        <ProgressBar value={10} animate={true} />
      </div>

      {/* Auto-credit */}
      <div style={{
        width: "100%", padding: 14, borderRadius: 12,
        border: `1.5px solid ${W.border}`, background: W.card,
        display: "flex", alignItems: "center", gap: 10,
        opacity: showCredit ? 1 : 0,
        transform: showCredit ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.4s ease",
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: W.filled, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 14, color: W.card, flexShrink: 0,
        }}>✓</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: W.text, fontFamily: font }}>
            Free class added to your account
          </div>
          <div style={{ fontSize: 10, color: W.light, fontFamily: font, marginTop: 2 }}>
            Credited automatically via Mindbody
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <WireButton bold onClick={onRedeem}>Show at Reception →</WireButton>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SCREEN: CONFIRMED + RESET (Journey 3)
// ═══════════════════════════════════════════════════
function ConfirmedScreen({ onDone }) {
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowEmail(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, height: "100%" }}>
      <div style={{ height: 24 }} />

      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        border: `2px solid ${W.border}`, background: W.card,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
      }}>🎁</div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: W.text, fontFamily: font }}>
          You're all set
        </div>
        <div style={{ fontSize: 12, color: W.light, fontFamily: font, marginTop: 4, lineHeight: 1.5 }}>
          Your free class is ready. Book your next session on Mindbody or Urban Sports Club.
        </div>
      </div>

      {/* Reset stamp card */}
      <div style={{
        width: "100%", padding: 16, borderRadius: 14,
        border: `1.5px solid ${W.border}`, background: W.card, textAlign: "center",
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: W.light, fontFamily: font, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
          Stamp card reset
        </div>
        <StampGrid filled={0} />
        <ProgressBar value={0} />
        <div style={{ fontSize: 11, color: W.light, fontFamily: font, marginTop: 10 }}>
          See you for the next 10!
        </div>
      </div>

      {/* Email upsell */}
      <div style={{
        width: "100%", padding: 14, borderRadius: 12,
        border: `1px dashed ${W.border}`, background: W.card,
        opacity: showEmail ? 1 : 0,
        transform: showEmail ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.4s ease",
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: W.text, fontFamily: font, marginBottom: 6 }}>
          Want studio updates?
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <input
            type="email" placeholder="your@email.com"
            style={{
              flex: 1, padding: "8px 10px", borderRadius: 8,
              border: `1px solid ${W.border}`, background: W.bg,
              fontSize: 12, fontFamily: font, color: W.text, outline: "none",
            }}
          />
          <div style={{
            padding: "8px 14px", borderRadius: 8, background: W.filled,
            fontSize: 12, fontWeight: 600, color: W.card, fontFamily: font,
            display: "flex", alignItems: "center", cursor: "pointer",
          }}>Save</div>
        </div>
        <div style={{ fontSize: 9, color: W.light, fontFamily: font, marginTop: 4 }}>
          Optional · add your email for event invites
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <WireButton onClick={onDone}>Done</WireButton>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// PHONE FRAME
// ═══════════════════════════════════════════════════
function PhoneFrame({ children, journeyLabel, journeyColor }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      {journeyLabel && (
        <div style={{
          padding: "3px 10px", borderRadius: 6, fontSize: 9, fontWeight: 700,
          fontFamily: font, letterSpacing: 0.8, textTransform: "uppercase",
          background: journeyColor || W.filled, color: "#fff",
        }}>
          {journeyLabel}
        </div>
      )}
      <div style={{
        width: 320, height: 640, borderRadius: 36,
        border: `2px solid ${W.border}`, background: W.bg,
        overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        position: "relative",
      }}>
        {/* Status bar */}
        <div style={{
          height: 44, display: "flex", alignItems: "center", justifyContent: "center",
          borderBottom: `1px solid ${W.border}`, background: W.bg,
          position: "relative", zIndex: 2,
        }}>
          <div style={{ width: 80, height: 6, borderRadius: 3, background: W.border }} />
        </div>
        <div style={{ height: 596, overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// JOURNEY SIMULATOR PANEL
// ═══════════════════════════════════════════════════
function JourneyPanel({ activeJourney, onSelectJourney }) {
  const journeys = [
    { id: 1, label: "First Check-in", desc: "New customer taps NFC", color: "#3D7B5F", screens: "Splash → Phone → Check-in (1/10)" },
    { id: 2, label: "Progressive", desc: "Returning customer, visit 7", color: "#5577AA", screens: "Splash → Instant Check-in (7/10)" },
    { id: 3, label: "Reward", desc: "10th visit — free class!", color: "#AA7755", screens: "Splash → Reward → Confirmed" },
  ];

  return (
    <div style={{
      width: 320, background: W.card, borderRadius: 16,
      border: `1px solid ${W.border}`, padding: 20,
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: W.light, fontFamily: font, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>
        Simulate a Journey
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {journeys.map(j => (
          <div
            key={j.id}
            onClick={() => onSelectJourney(j.id)}
            style={{
              padding: 14, borderRadius: 12, cursor: "pointer",
              border: `1.5px solid ${activeJourney === j.id ? j.color : W.border}`,
              background: activeJourney === j.id ? `${j.color}08` : W.card,
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{
                width: 20, height: 20, borderRadius: 5,
                background: j.color, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 10, fontWeight: 700,
                color: "#fff", fontFamily: font, flexShrink: 0,
              }}>{j.id}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: W.text, fontFamily: font }}>{j.label}</div>
            </div>
            <div style={{ fontSize: 11, color: W.light, fontFamily: font, marginBottom: 4 }}>{j.desc}</div>
            <div style={{
              fontSize: 10, color: j.color, fontFamily: font, fontWeight: 600,
              padding: "3px 0", borderTop: `1px solid ${W.empty}`, marginTop: 4,
            }}>
              {j.screens}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 16, padding: 12, borderRadius: 8,
        background: W.bg, fontSize: 11, color: W.light,
        fontFamily: font, lineHeight: 1.6,
      }}>
        <strong style={{ color: W.text }}>How it works:</strong> Select a journey, then interact with the prototype. Each journey simulates a real NFC tap scenario.
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN APP — Interactive Prototype
// ═══════════════════════════════════════════════════
export default function TapInPrototype() {
  const [activeJourney, setActiveJourney] = useState(null);
  const [currentScreen, setCurrentScreen] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  const journeyColors = { 1: "#3D7B5F", 2: "#5577AA", 3: "#AA7755" };
  const journeyLabels = { 1: "Journey 1 · First Check-in", 2: "Journey 2 · Progressive", 3: "Journey 3 · Reward" };

  const navigateTo = (screen) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(screen);
      setTransitioning(false);
    }, 200);
  };

  const startJourney = (id) => {
    setActiveJourney(id);
    navigateTo(SCREENS.SPLASH);
  };

  const handleSplashComplete = () => {
    if (activeJourney === 1) navigateTo(SCREENS.PHONE);
    else if (activeJourney === 2) navigateTo(SCREENS.INSTANT_7);
    else if (activeJourney === 3) navigateTo(SCREENS.REWARD);
  };

  const resetToStart = () => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(null);
      setActiveJourney(null);
      setTransitioning(false);
    }, 200);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case SCREENS.SPLASH:
        return <SplashScreen onComplete={handleSplashComplete} />;
      case SCREENS.PHONE:
        return <PhoneEntryScreen onSubmit={() => navigateTo(SCREENS.CHECKIN_1)} />;
      case SCREENS.CHECKIN_1:
        return <CheckinScreen visitNumber={1} isFirstTime={true} onDone={resetToStart} />;
      case SCREENS.INSTANT_7:
        return <CheckinScreen visitNumber={7} isFirstTime={false} onDone={resetToStart} />;
      case SCREENS.REWARD:
        return <RewardScreen onRedeem={() => navigateTo(SCREENS.CONFIRMED)} />;
      case SCREENS.CONFIRMED:
        return <ConfirmedScreen onDone={resetToStart} />;
      default:
        return (
          <div style={{
            height: "100%", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 16, padding: 30,
          }}>
            <div style={{ fontSize: 40 }}>👆</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: W.text, fontFamily: font, textAlign: "center" }}>
              Select a journey
            </div>
            <div style={{ fontSize: 12, color: W.light, fontFamily: font, textAlign: "center", lineHeight: 1.6 }}>
              Choose a customer journey from the panel to simulate an NFC tap experience
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", padding: "40px 20px", fontFamily: font }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: W.text, margin: "0 0 8px" }}>
          TapIn — Interactive Prototype
        </h1>
        <p style={{ fontSize: 13, color: W.light, margin: 0 }}>
          Step 4 · Click through each journey — lo-fi wireframes with interactions
        </p>
      </div>

      {/* Main layout */}
      <div style={{
        display: "flex", gap: 40, justifyContent: "center",
        alignItems: "flex-start", flexWrap: "wrap",
      }}>
        <JourneyPanel activeJourney={activeJourney} onSelectJourney={startJourney} />

        <div style={{ position: "relative" }}>
          <PhoneFrame
            journeyLabel={activeJourney ? journeyLabels[activeJourney] : null}
            journeyColor={activeJourney ? journeyColors[activeJourney] : null}
          >
            <div style={{
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? "translateX(20px)" : "translateX(0)",
              transition: "all 0.2s ease",
              height: "100%",
            }}>
              {renderScreen()}
            </div>
          </PhoneFrame>

          {/* Replay button */}
          {currentScreen && (
            <div
              onClick={resetToStart}
              style={{
                position: "absolute", bottom: -40, left: "50%", transform: "translateX(-50%)",
                padding: "6px 16px", borderRadius: 20,
                border: `1px solid ${W.border}`, background: W.card,
                fontSize: 11, fontWeight: 600, color: W.light, fontFamily: font,
                cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              ↻ Restart
            </div>
          )}
        </div>
      </div>

      {/* Screen indicator */}
      {activeJourney && (
        <div style={{
          textAlign: "center", marginTop: 60,
          fontSize: 11, color: W.light, fontFamily: font,
        }}>
          Currently viewing: <strong style={{ color: journeyColors[activeJourney] }}>
            {currentScreen || "selecting..."}
          </strong> in Journey {activeJourney}
        </div>
      )}
    </div>
  );
}

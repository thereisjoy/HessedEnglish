import { useState, useEffect, useRef, useCallback } from "react";

// ─── Intersection Observer Hook ───
function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold: 0.15, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, isInView];
}

// ─── Scroll Progress Hook ───
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

// ─── DESIGN TOKENS (Nexa-inspired) ───
const T = {
  bg: "#0D0D0D",
  surface: "#141414",
  card: "#1A1A1A",
  border: "rgba(255,255,255,0.08)",
  text: "#FFFFFF",
  textSub: "rgba(255,255,255,0.52)",
  textMuted: "rgba(255,255,255,0.3)",
  accent: "#F7521B",
  accentHover: "#FF6B3D",
  blue: "#1BAAF7",
  green: "#1BF759",
  font: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
  maxW: "1520px",
  radius: { sm: "8px", md: "12px", lg: "24px", xl: "40px", pill: "100px" },
};

// ─── BLOG DATA (from extracted content) ───
const STATS = {
  totalPosts: 400,
  years: "7+",
  students: "500+",
  satisfaction: "97%",
};

const COURSES = [
  {
    id: "speaking",
    label: "IELTS Speaking",
    count: 236,
    icon: "🎙️",
    description: "기출 주제별 모범답안과 핵심 전략으로 Speaking 7.0+ 달성",
    topics: ["Part 1 일상 주제", "Part 2 큐카드 전략", "Part 3 심화 토론", "발음 & 유창성 훈련"],
    color: T.accent,
  },
  {
    id: "writing",
    label: "IELTS Writing",
    count: 259,
    icon: "✍️",
    description: "Task 1 & Task 2 완벽 분석, 실전 에세이 구조 마스터",
    topics: ["Task 1 데이터 분석", "Task 2 에세이 구조", "밴드별 채점 기준", "고급 표현 & 문법"],
    color: T.blue,
  },
  {
    id: "academic",
    label: "Academic Writing",
    count: 22,
    icon: "📚",
    description: "논문, 리포트, 학술 에세이의 격식 있는 영어 작문",
    topics: ["논문 구조 & 형식", "학술 어휘 활용", "인용 & 참조", "비판적 분석 작문"],
    color: T.green,
  },
  {
    id: "business",
    label: "Business English",
    count: 18,
    icon: "💼",
    description: "비즈니스 이메일부터 프레젠테이션까지 실무 영어 완성",
    topics: ["비즈니스 이메일", "회의 영어", "프레젠테이션 스킬", "협상 & 네트워킹"],
    color: "#E8A87C",
  },
];

const TESTIMONIALS = [
  { name: "김서연", score: "7.5", before: "6.0", text: "Isabel 선생님 덕분에 3개월 만에 Speaking 7.5 달성! 체계적인 피드백이 정말 큰 도움이 되었어요.", tag: "IELTS Speaking" },
  { name: "이준호", score: "8.0", before: "6.5", text: "Writing Task 2에서 항상 막혔는데, 에세이 구조를 확실히 잡아주셔서 자신감이 생겼습니다.", tag: "IELTS Writing" },
  { name: "박민지", score: "7.0", before: "5.5", text: "유학 준비하면서 Academic Writing도 함께 배웠는데, 실제 대학 과제에서 바로 활용할 수 있었어요.", tag: "Academic Writing" },
];

const BLOG_SAMPLES = [
  { title: "IELTS Speaking Part 2: Describe a Time You Helped Someone", date: "2024.06", category: "Speaking" },
  { title: "Task 2 Essay Structure: To What Extent Do You Agree?", date: "2024.05", category: "Writing" },
  { title: "비즈니스 이메일에서 자주 쓰는 영어 표현 20가지", date: "2024.04", category: "Business" },
  { title: "IELTS Writing Task 1: Line Graph 분석 완벽 가이드", date: "2024.03", category: "Writing" },
  { title: "영어 면접 준비: 자기소개부터 마무리까지", date: "2024.02", category: "Business" },
  { title: "IELTS Speaking Part 3: Education 주제 심화 답변", date: "2024.01", category: "Speaking" },
];

// ─── FADE-IN COMPONENT ───
function FadeIn({ children, delay = 0, className = "", direction = "up" }) {
  const [ref, isInView] = useInView();
  const transforms = { up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(40px)", right: "translateX(-40px)", none: "none" };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "none" : transforms[direction],
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ─── SECTION LABEL ───
function SectionLabel({ text }) {
  return (
    <span style={{
      fontFamily: T.mono, fontSize: "11px", letterSpacing: "2px",
      color: T.textMuted, textTransform: "uppercase",
      padding: "6px 14px", border: `1px solid ${T.border}`,
      borderRadius: T.radius.pill, display: "inline-block",
    }}>
      {text}
    </span>
  );
}

// ═══════════════════════════════════════════
// 1. NAVIGATION
// ═══════════════════════════════════════════
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    { label: "Courses", href: "#courses" },
    { label: "Results", href: "#results" },
    { label: "About", href: "#about" },
    { label: "Blog", href: "#blog" },
    { label: "Pricing", href: "#pricing" },
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(13,13,13,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${T.border}` : "none",
      transition: "all 0.4s ease",
      padding: "0 clamp(20px, 4vw, 60px)",
    }}>
      <div style={{
        maxWidth: T.maxW, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "72px",
      }}>
        <a href="#" style={{ fontFamily: T.font, fontWeight: 700, fontSize: "20px", color: T.text, textDecoration: "none", letterSpacing: "-0.5px" }}>
          Isabel<span style={{ color: T.accent }}>*</span>
        </a>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}
          className="nav-links">
          {links.map(l => (
            <a key={l.href} href={l.href} style={{
              fontFamily: T.font, fontSize: "13px", color: T.textSub,
              textDecoration: "none", letterSpacing: "0.5px",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = T.text}
              onMouseLeave={e => e.target.style.color = T.textSub}
            >{l.label}</a>
          ))}
          <a href="#pricing" style={{
            fontFamily: T.font, fontSize: "13px", fontWeight: 600,
            color: T.bg, background: T.text,
            padding: "10px 24px", borderRadius: T.radius.pill,
            textDecoration: "none", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.target.style.background = T.accent; e.target.style.color = T.text; }}
            onMouseLeave={e => { e.target.style.background = T.text; e.target.style.color = T.bg; }}
          >Start Learning</a>
        </div>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════
// 2. HERO
// ═══════════════════════════════════════════
function Hero() {
  const [ref, isInView] = useInView();
  return (
    <section ref={ref} style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "flex-end", padding: "0 clamp(20px, 4vw, 60px)",
      paddingBottom: "80px", position: "relative", overflow: "hidden",
      background: `linear-gradient(180deg, #0D0D0D 0%, #1a1008 50%, #0D0D0D 100%)`,
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "20%", left: "50%", transform: "translate(-50%,-50%)",
        width: "800px", height: "800px",
        background: `radial-gradient(circle, rgba(247,82,27,0.06) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{ maxWidth: T.maxW, margin: "0 auto", width: "100%", position: "relative" }}>
        <FadeIn delay={0.2}>
          <p style={{
            fontFamily: T.mono, fontSize: "13px", color: T.textMuted,
            letterSpacing: "3px", marginBottom: "24px", textTransform: "uppercase",
          }}>
            동시통역사 출신 영어 튜터 — Since 2019
          </p>
        </FadeIn>
        <FadeIn delay={0.4}>
          <h1 style={{
            fontFamily: T.font, fontWeight: 700,
            fontSize: "clamp(48px, 10vw, 160px)",
            lineHeight: 0.95, letterSpacing: "-0.03em",
            color: T.text, margin: 0,
          }}>
            MASTER
            <br />
            <span style={{ color: T.textSub }}>ENGLISH</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.6}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-end",
            marginTop: "40px", flexWrap: "wrap", gap: "20px",
          }}>
            <p style={{
              fontFamily: T.font, fontSize: "clamp(16px, 2vw, 20px)",
              color: T.textSub, maxWidth: "400px", lineHeight: 1.6,
            }}>
              7년간 블로그에서 검증된 400+개의<br />
              영어 학습 콘텐츠를 체계적 커리큘럼으로.
            </p>
            <a href="#courses" style={{
              fontFamily: T.mono, fontSize: "12px", color: T.textMuted,
              textDecoration: "none", letterSpacing: "2px",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              SCROLL ↓
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// 3. VALUE PROPOSITION (transition copy)
// ═══════════════════════════════════════════
function ValueProp() {
  return (
    <section style={{
      padding: "120px clamp(20px, 4vw, 60px)",
      borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <FadeIn>
          <p style={{
            fontFamily: T.font, fontSize: "clamp(20px, 3vw, 32px)",
            color: T.text, lineHeight: 1.6, fontWeight: 400,
            textAlign: "center",
          }}>
            <span style={{ color: T.textSub }}>블로그에서 시작된 영어 교육이</span>
            {" "}체계적인 학습 플랫폼으로 진화했습니다.{" "}
            <span style={{ color: T.textSub }}>
              IELTS, Academic, Business —
            </span>
            {" "}당신이 필요한 영어, 여기에 다 있습니다.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// 4. STATS COUNTER
// ═══════════════════════════════════════════
function StatsBar() {
  const items = [
    { value: "400+", label: "학습 콘텐츠" },
    { value: "7년+", label: "교육 경력" },
    { value: "500+", label: "수강생" },
    { value: "97%", label: "만족도" },
  ];
  return (
    <section style={{ padding: "80px clamp(20px, 4vw, 60px)", borderBottom: `1px solid ${T.border}` }}>
      <div style={{
        maxWidth: T.maxW, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "40px",
      }}>
        {items.map((item, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: T.font, fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 700, color: T.text, letterSpacing: "-0.03em",
              }}>{item.value}</div>
              <div style={{
                fontFamily: T.mono, fontSize: "12px", color: T.textMuted,
                letterSpacing: "2px", marginTop: "8px", textTransform: "uppercase",
              }}>{item.label}</div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// 5. COURSES — Interactive Tabs + Preview
// ═══════════════════════════════════════════
function Courses() {
  const [active, setActive] = useState(0);
  const course = COURSES[active];
  return (
    <section id="courses" style={{ padding: "140px clamp(20px, 4vw, 60px)" }}>
      <div style={{ maxWidth: T.maxW, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "60px", flexWrap: "wrap", gap: "20px" }}>
            <h2 style={{
              fontFamily: T.font, fontWeight: 700,
              fontSize: "clamp(36px, 7vw, 96px)",
              lineHeight: 0.95, letterSpacing: "-0.03em", color: T.text, margin: 0,
            }}>
              LEARN ENGLISH
              <br />
              <span style={{ color: T.textSub }}>YOUR WAY</span>
            </h2>
            <SectionLabel text="COURSES" />
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}
          className="courses-grid">
          {/* Left: tabs */}
          <FadeIn delay={0.2}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {COURSES.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setActive(i)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: "24px 0",
                    borderTop: i === 0 ? `1px solid ${T.border}` : "none",
                    borderBottom: `1px solid ${T.border}`,
                    display: "flex", alignItems: "center", gap: "20px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <span style={{
                    fontFamily: T.mono, fontSize: "14px",
                    color: active === i ? c.color : T.textMuted,
                    transition: "color 0.3s",
                    minWidth: "28px",
                  }}>0{i + 1}</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{
                      fontFamily: T.font, fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 600,
                      color: active === i ? T.text : T.textSub,
                      transition: "color 0.3s",
                    }}>{c.label}</div>
                    <div style={{
                      fontFamily: T.font, fontSize: "14px",
                      color: T.textMuted, marginTop: "4px",
                    }}>{c.count}개 콘텐츠</div>
                  </div>
                  <span style={{
                    marginLeft: "auto", fontSize: "24px",
                    opacity: active === i ? 1 : 0,
                    transition: "opacity 0.3s",
                  }}>→</span>
                </button>
              ))}
            </div>
          </FadeIn>

          {/* Right: preview card */}
          <FadeIn delay={0.4}>
            <div style={{
              background: T.card, borderRadius: T.radius.xl,
              padding: "48px", border: `1px solid ${T.border}`,
              transition: "all 0.4s ease", position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "4px",
                background: course.color, transition: "background 0.4s",
              }} />
              <span style={{ fontSize: "48px", display: "block", marginBottom: "24px" }}>
                {course.icon}
              </span>
              <h3 style={{
                fontFamily: T.font, fontSize: "28px", fontWeight: 700,
                color: T.text, marginBottom: "12px",
              }}>{course.label}</h3>
              <p style={{
                fontFamily: T.font, fontSize: "16px", color: T.textSub,
                lineHeight: 1.7, marginBottom: "32px",
              }}>{course.description}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {course.topics.map((topic, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    fontFamily: T.font, fontSize: "14px", color: T.textSub,
                  }}>
                    <span style={{ color: course.color, fontSize: "8px" }}>●</span>
                    {topic}
                  </div>
                ))}
              </div>
              <button style={{
                marginTop: "40px", fontFamily: T.font, fontSize: "14px",
                fontWeight: 600, color: T.text,
                background: "none", border: `1px solid ${T.border}`,
                padding: "14px 32px", borderRadius: T.radius.pill,
                cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.target.style.background = T.text; e.target.style.color = T.bg; }}
                onMouseLeave={e => { e.target.style.background = "none"; e.target.style.color = T.text; }}
              >
                자세히 보기 →
              </button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// 6. RESULTS — Data Visualization
// ═══════════════════════════════════════════
function Results() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { label: "Score Improvement", data: { value: "+1.5", unit: "밴드", desc: "평균 IELTS 점수 향상", chart: [30, 42, 55, 63, 72, 80, 87, 92] } },
    { label: "Satisfaction", data: { value: "97%", unit: "", desc: "수강생 만족도", chart: [85, 88, 90, 92, 94, 95, 96, 97] } },
    { label: "Completion", data: { value: "89%", unit: "", desc: "코스 완주율", chart: [65, 70, 75, 78, 82, 85, 87, 89] } },
  ];
  const tab = tabs[activeTab];
  const maxVal = Math.max(...tab.data.chart);

  return (
    <section id="results" style={{
      padding: "140px clamp(20px, 4vw, 60px)",
      background: T.surface,
    }}>
      <div style={{ maxWidth: T.maxW, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "80px", flexWrap: "wrap", gap: "20px" }}>
            <h2 style={{
              fontFamily: T.font, fontWeight: 700,
              fontSize: "clamp(36px, 7vw, 96px)",
              lineHeight: 0.95, letterSpacing: "-0.03em", color: T.text, margin: 0,
            }}>
              PROVEN
              <br />
              <span style={{ color: T.textSub }}>RESULTS</span>
            </h2>
            <SectionLabel text="DATA" />
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "60px" }}
          className="results-grid">
          {/* Tabs */}
          <FadeIn delay={0.2}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {tabs.map((t, i) => (
                <button key={i} onClick={() => setActiveTab(i)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "16px 20px", borderRadius: T.radius.sm,
                  textAlign: "left", transition: "all 0.2s",
                  background: activeTab === i ? T.card : "transparent",
                }}>
                  <div style={{
                    fontFamily: T.font, fontSize: "15px", fontWeight: activeTab === i ? 600 : 400,
                    color: activeTab === i ? T.text : T.textMuted,
                    display: "flex", alignItems: "center", gap: "10px",
                  }}>
                    <span style={{
                      width: "6px", height: "6px", borderRadius: "50%",
                      background: activeTab === i ? T.accent : "transparent",
                      transition: "background 0.2s",
                    }} />
                    {t.label}
                  </div>
                </button>
              ))}
              <div style={{
                fontFamily: T.font, fontSize: "14px", color: T.textSub,
                lineHeight: 1.7, padding: "24px 20px", marginTop: "16px",
              }}>
                "{tab.data.desc}"
              </div>
            </div>
          </FadeIn>

          {/* Chart area */}
          <FadeIn delay={0.4}>
            <div style={{
              background: T.card, borderRadius: T.radius.xl,
              padding: "48px", border: `1px solid ${T.border}`,
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "40px" }}>
                <span style={{
                  fontFamily: T.font, fontSize: "clamp(48px, 6vw, 80px)",
                  fontWeight: 700, color: T.text, letterSpacing: "-0.03em",
                }}>{tab.data.value}</span>
                <span style={{
                  fontFamily: T.font, fontSize: "18px", color: T.textMuted,
                }}>{tab.data.unit}</span>
              </div>
              {/* Mini bar chart */}
              <div style={{
                display: "flex", alignItems: "flex-end", gap: "8px", height: "160px",
                padding: "0 4px",
              }}>
                {tab.data.chart.map((v, i) => (
                  <div key={i} style={{
                    flex: 1, borderRadius: "4px 4px 0 0",
                    height: `${(v / maxVal) * 100}%`,
                    background: i === tab.data.chart.length - 1 ? T.accent : `rgba(255,255,255,0.08)`,
                    transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
                  }} />
                ))}
              </div>
              <div style={{
                fontFamily: T.mono, fontSize: "11px", color: T.textMuted,
                letterSpacing: "1px", marginTop: "16px",
              }}>
                FIG 1.{activeTab + 1} — {tab.data.desc.toUpperCase()}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// 7. ABOUT — Instructor Profile (Hover style)
// ═══════════════════════════════════════════
function About() {
  const credentials = [
    { role: "동시통역사", name: "ISABEL KIM" },
    { role: "영어 전문 튜터", name: "HESSEDU" },
    { role: "IELTS 전문강사", name: "7년+ 경력" },
    { role: "블로그 콘텐츠 크리에이터", name: "400+ 포스트" },
  ];
  const [hovered, setHovered] = useState(0);

  return (
    <section id="about" style={{ padding: "140px clamp(20px, 4vw, 60px)" }}>
      <div style={{ maxWidth: T.maxW, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "80px", flexWrap: "wrap", gap: "20px" }}>
            <h2 style={{
              fontFamily: T.font, fontWeight: 700,
              fontSize: "clamp(36px, 7vw, 96px)",
              lineHeight: 0.95, letterSpacing: "-0.03em", color: T.text, margin: 0,
            }}>
              MEET YOUR
              <br />
              <span style={{ color: T.textSub }}>INSTRUCTOR</span>
            </h2>
            <SectionLabel text="ABOUT" />
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}
          className="about-grid">
          <FadeIn delay={0.2}>
            <div>
              {credentials.map((c, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHovered(i)}
                  style={{
                    padding: "20px 0",
                    borderBottom: `1px solid ${T.border}`,
                    cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "baseline",
                    transition: "opacity 0.3s",
                    opacity: hovered === i ? 1 : 0.35,
                  }}
                >
                  <span style={{
                    fontFamily: T.font, fontSize: "14px", color: T.textSub,
                  }}>{c.role}</span>
                  <span style={{
                    fontFamily: T.font, fontSize: "clamp(24px, 4vw, 48px)",
                    fontWeight: 700, color: T.text, letterSpacing: "-0.02em",
                  }}>{c.name}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div style={{
              background: T.card, borderRadius: T.radius.xl,
              padding: "48px", border: `1px solid ${T.border}`,
            }}>
              <p style={{
                fontFamily: T.font, fontSize: "18px", color: T.textSub,
                lineHeight: 1.8, marginBottom: "32px",
              }}>
                안녕하세요, Isabel Kim입니다. 동시통역사로 시작해 영어 교육에 열정을 쏟고 있습니다.
                2019년부터 시작한 블로그에 400편 이상의 영어 학습 콘텐츠를 쌓아왔고,
                이제 그 노하우를 체계적인 커리큘럼으로 제공합니다.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {["IELTS", "Academic", "Business", "통역"].map(tag => (
                  <span key={tag} style={{
                    fontFamily: T.mono, fontSize: "12px", color: T.textMuted,
                    padding: "6px 14px", border: `1px solid ${T.border}`,
                    borderRadius: T.radius.pill,
                  }}>{tag}</span>
                ))}
              </div>
              <div style={{
                marginTop: "32px", fontFamily: T.mono, fontSize: "13px",
                color: T.textMuted,
              }}>
                ✉️ isabella.kim0722@gmail.com
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// 8. TESTIMONIALS
// ═══════════════════════════════════════════
function Testimonials() {
  return (
    <section style={{
      padding: "140px clamp(20px, 4vw, 60px)",
      background: T.surface,
    }}>
      <div style={{ maxWidth: T.maxW, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "60px", flexWrap: "wrap", gap: "20px" }}>
            <h2 style={{
              fontFamily: T.font, fontWeight: 700,
              fontSize: "clamp(36px, 7vw, 96px)",
              lineHeight: 0.95, letterSpacing: "-0.03em", color: T.text, margin: 0,
            }}>
              STUDENT
              <br />
              <span style={{ color: T.textSub }}>REVIEWS</span>
            </h2>
            <SectionLabel text="TESTIMONIALS" />
          </div>
        </FadeIn>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px",
        }}>
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div style={{
                background: T.card, borderRadius: T.radius.lg,
                padding: "40px", border: `1px solid ${T.border}`,
                display: "flex", flexDirection: "column", height: "100%",
              }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: "24px",
                }}>
                  <span style={{
                    fontFamily: T.mono, fontSize: "11px", color: T.accent,
                    padding: "4px 10px", border: `1px solid rgba(247,82,27,0.3)`,
                    borderRadius: T.radius.pill,
                  }}>{t.tag}</span>
                  <span style={{
                    fontFamily: T.font, fontSize: "14px", color: T.textMuted,
                  }}>{t.before} → <span style={{ color: T.text, fontWeight: 700 }}>{t.score}</span></span>
                </div>
                <p style={{
                  fontFamily: T.font, fontSize: "16px", color: T.textSub,
                  lineHeight: 1.7, flex: 1, marginBottom: "24px",
                }}>"{t.text}"</p>
                <div style={{
                  fontFamily: T.font, fontSize: "14px", fontWeight: 600,
                  color: T.text,
                }}>{t.name}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// 9. BLOG PREVIEW
// ═══════════════════════════════════════════
function BlogPreview() {
  return (
    <section id="blog" style={{ padding: "140px clamp(20px, 4vw, 60px)" }}>
      <div style={{ maxWidth: T.maxW, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "60px", flexWrap: "wrap", gap: "20px" }}>
            <h2 style={{
              fontFamily: T.font, fontWeight: 700,
              fontSize: "clamp(36px, 7vw, 96px)",
              lineHeight: 0.95, letterSpacing: "-0.03em", color: T.text, margin: 0,
            }}>
              FROM THE
              <br />
              <span style={{ color: T.textSub }}>BLOG</span>
            </h2>
            <SectionLabel text="BLOG" />
          </div>
        </FadeIn>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px",
        }}>
          {BLOG_SAMPLES.map((post, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <a href="#" style={{
                background: T.card, borderRadius: T.radius.md,
                padding: "32px", border: `1px solid ${T.border}`,
                textDecoration: "none", display: "block",
                transition: "all 0.3s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: "16px",
                }}>
                  <span style={{
                    fontFamily: T.mono, fontSize: "11px", color: T.accent,
                    padding: "3px 10px", background: "rgba(247,82,27,0.1)",
                    borderRadius: T.radius.pill,
                  }}>{post.category}</span>
                  <span style={{
                    fontFamily: T.mono, fontSize: "12px", color: T.textMuted,
                  }}>{post.date}</span>
                </div>
                <h3 style={{
                  fontFamily: T.font, fontSize: "16px", fontWeight: 600,
                  color: T.text, lineHeight: 1.5, margin: 0,
                }}>{post.title}</h3>
              </a>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.6}>
          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <a href="https://blog.naver.com/isabelkim722" target="_blank" style={{
              fontFamily: T.font, fontSize: "14px", color: T.textSub,
              textDecoration: "none", transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = T.text}
              onMouseLeave={e => e.target.style.color = T.textSub}
            >
              전체 블로그 보기 →
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// 10. PRICING
// ═══════════════════════════════════════════
function Pricing() {
  const plans = [
    {
      name: "Premium",
      desc: "체계적 학습을 원하는 분",
      price: "₩29,900",
      unit: "/월",
      features: ["전 강좌 무제한 접근", "1:1 맞춤 피드백", "원어민 첨삭 서비스", "주간 학습 리포트", "커뮤니티 접근"],
      cta: "14일 무료 체험",
      highlight: true,
    },
    {
      name: "Basic",
      desc: "가볍게 시작하는 영어 학습",
      price: "무료",
      unit: "",
      features: ["기초 강좌 5개", "주간 퀴즈", "커뮤니티 접근"],
      cta: "시작하기",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" style={{
      padding: "140px clamp(20px, 4vw, 60px)",
      background: T.surface,
    }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <FadeIn>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "20px" }}>
            <h2 style={{
              fontFamily: T.font, fontWeight: 700,
              fontSize: "clamp(36px, 7vw, 96px)",
              lineHeight: 0.95, letterSpacing: "-0.03em", color: T.text, margin: 0,
            }}>
              SIMPLE
              <br />
              <span style={{ color: T.textSub }}>PRICING</span>
            </h2>
            <SectionLabel text="PRICING" />
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p style={{
            fontFamily: T.font, fontSize: "14px", color: T.textMuted,
            marginBottom: "60px",
          }}>
            궁금한 점이 있으시면 <a href="mailto:isabella.kim0722@gmail.com" style={{ color: T.accent, textDecoration: "none" }}>여기로 문의하세요</a>.
          </p>
        </FadeIn>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px",
        }}>
          {plans.map((plan, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div style={{
                background: T.card, borderRadius: T.radius.lg,
                padding: "48px", border: `1px solid ${plan.highlight ? "rgba(247,82,27,0.3)" : T.border}`,
                position: "relative", overflow: "hidden",
              }}>
                {plan.highlight && <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                  background: T.accent,
                }} />}
                <h3 style={{
                  fontFamily: T.font, fontSize: "20px", fontWeight: 700,
                  color: T.text, marginBottom: "8px",
                }}>{plan.name}</h3>
                <p style={{
                  fontFamily: T.font, fontSize: "14px", color: T.textMuted,
                  marginBottom: "32px",
                }}>{plan.desc}</p>
                <div style={{
                  display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "32px",
                }}>
                  <span style={{
                    fontFamily: T.font, fontSize: "40px", fontWeight: 700, color: T.text,
                  }}>{plan.price}</span>
                  <span style={{
                    fontFamily: T.font, fontSize: "16px", color: T.textMuted,
                  }}>{plan.unit}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "40px" }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      fontFamily: T.font, fontSize: "14px", color: T.textSub,
                    }}>
                      <span style={{ color: T.accent, fontSize: "10px" }}>★</span>
                      {f}
                    </div>
                  ))}
                </div>
                <button style={{
                  width: "100%", fontFamily: T.font, fontSize: "14px", fontWeight: 600,
                  padding: "16px", borderRadius: T.radius.pill, cursor: "pointer",
                  border: "none", transition: "all 0.2s",
                  background: plan.highlight ? T.accent : "transparent",
                  color: plan.highlight ? T.text : T.text,
                  ...(plan.highlight ? {} : { border: `1px solid ${T.border}` }),
                }}
                  onMouseEnter={e => {
                    if (plan.highlight) e.target.style.background = T.accentHover;
                    else { e.target.style.background = T.text; e.target.style.color = T.bg; }
                  }}
                  onMouseLeave={e => {
                    if (plan.highlight) e.target.style.background = T.accent;
                    else { e.target.style.background = "transparent"; e.target.style.color = T.text; }
                  }}
                >{plan.cta}</button>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// 11. CTA
// ═══════════════════════════════════════════
function CTA() {
  return (
    <section style={{ padding: "140px clamp(20px, 4vw, 60px)" }}>
      <div style={{ maxWidth: T.maxW, margin: "0 auto", textAlign: "center" }}>
        <FadeIn>
          <h2 style={{
            fontFamily: T.font, fontWeight: 700,
            fontSize: "clamp(36px, 8vw, 120px)",
            lineHeight: 0.95, letterSpacing: "-0.03em", color: T.text, margin: 0,
          }}>
            START YOUR
            <br />
            <span style={{ color: T.textSub }}>JOURNEY.</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div style={{ marginTop: "48px", display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <a href="#pricing" style={{
              fontFamily: T.font, fontSize: "15px", fontWeight: 600,
              color: T.text, background: T.accent,
              padding: "16px 40px", borderRadius: T.radius.pill,
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px",
              transition: "background 0.2s",
            }}
              onMouseEnter={e => e.target.style.background = T.accentHover}
              onMouseLeave={e => e.target.style.background = T.accent}
            >
              <span>★</span> 무료로 시작하기
            </a>
          </div>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p style={{
            fontFamily: T.font, fontSize: "14px", color: T.textMuted,
            marginTop: "20px",
          }}>
            500+ 수강생이 선택한 영어 교육 플랫폼
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// 12. FOOTER
// ═══════════════════════════════════════════
function Footer() {
  return (
    <footer style={{
      padding: "80px clamp(20px, 4vw, 60px)",
      borderTop: `1px solid ${T.border}`,
    }}>
      <div style={{ maxWidth: T.maxW, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "40px", marginBottom: "80px",
        }}>
          <div>
            <div style={{ fontFamily: T.mono, fontSize: "11px", color: T.textMuted, letterSpacing: "2px", marginBottom: "20px" }}>NAVIGATION</div>
            {["Courses", "Results", "About", "Blog", "Pricing"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{
                display: "block", fontFamily: T.font, fontSize: "14px",
                color: T.textSub, textDecoration: "none", padding: "6px 0",
                transition: "color 0.2s",
              }}
                onMouseEnter={e => e.target.style.color = T.text}
                onMouseLeave={e => e.target.style.color = T.textSub}
              >{l}</a>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: T.mono, fontSize: "11px", color: T.textMuted, letterSpacing: "2px", marginBottom: "20px" }}>LEGAL</div>
            {["이용약관", "개인정보처리방침"].map(l => (
              <a key={l} href="#" style={{
                display: "block", fontFamily: T.font, fontSize: "14px",
                color: T.textSub, textDecoration: "none", padding: "6px 0",
              }}>{l}</a>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: T.mono, fontSize: "11px", color: T.textMuted, letterSpacing: "2px", marginBottom: "20px" }}>SOCIAL</div>
            {["Blog (Naver)", "Instagram", "KakaoTalk"].map(l => (
              <a key={l} href="#" style={{
                display: "block", fontFamily: T.font, fontSize: "14px",
                color: T.textSub, textDecoration: "none", padding: "6px 0",
              }}>{l}</a>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: T.mono, fontSize: "11px", color: T.textMuted, letterSpacing: "2px", marginBottom: "20px" }}>NEWSLETTER</div>
            <p style={{ fontFamily: T.font, fontSize: "14px", color: T.textSub, marginBottom: "16px", lineHeight: 1.6 }}>
              주간 영어 학습 팁을 받아보세요.
            </p>
            <div style={{ display: "flex", gap: "0" }}>
              <input placeholder="이메일 주소" style={{
                flex: 1, fontFamily: T.font, fontSize: "13px",
                background: T.card, border: `1px solid ${T.border}`,
                borderRight: "none", borderRadius: `${T.radius.pill} 0 0 ${T.radius.pill}`,
                padding: "12px 18px", color: T.text, outline: "none",
              }} />
              <button style={{
                fontFamily: T.font, fontSize: "13px", fontWeight: 600,
                background: T.accent, border: "none", color: T.text,
                padding: "12px 20px", borderRadius: `0 ${T.radius.pill} ${T.radius.pill} 0`,
                cursor: "pointer",
              }}>→</button>
            </div>
          </div>
        </div>

        {/* Large brand logo */}
        <div style={{
          textAlign: "center", paddingTop: "60px", borderTop: `1px solid ${T.border}`,
        }}>
          <div style={{
            fontFamily: T.font, fontWeight: 700,
            fontSize: "clamp(40px, 8vw, 120px)",
            letterSpacing: "0.1em", color: "rgba(255,255,255,0.04)",
            userSelect: "none",
          }}>
            Isabel<span style={{ color: "rgba(247,82,27,0.15)" }}>*</span>
          </div>
          <p style={{
            fontFamily: T.mono, fontSize: "12px", color: T.textMuted, marginTop: "16px",
          }}>
            © 2026 HessEDU. Beautifully Imperfect.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════
// RESPONSIVE STYLES
// ═══════════════════════════════════════════
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { background: ${T.bg}; color: ${T.text}; font-family: ${T.font}; -webkit-font-smoothing: antialiased; }
      ::selection { background: ${T.accent}; color: ${T.text}; }
      input::placeholder { color: ${T.textMuted}; }
      @media (max-width: 768px) {
        .courses-grid, .results-grid, .about-grid { grid-template-columns: 1fr !important; }
        .nav-links { display: none !important; }
      }
    `}</style>
  );
}

// ═══════════════════════════════════════════
// APP
// ═══════════════════════════════════════════
export default function App() {
  return (
    <>
      <GlobalStyles />
      <Nav />
      <Hero />
      <ValueProp />
      <StatsBar />
      <Courses />
      <Results />
      <About />
      <Testimonials />
      <BlogPreview />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}
import { useTranslations, useLocale } from "next-intl"
import Link from "next/link"
import { TechStack } from "@/components/ui/TechStack"
import { siteConfig } from "@/config/site"

const timeline = [
  {
    company: "Clínica Santa Martha",
    title: { es: "Pasante de Sistemas", en: "Systems Intern" },
    date: "2018",
  },
  {
    company: "HE-LLO S.A.",
    title: { es: "Desarrollador Backend", en: "Backend Developer" },
    date: "2022 – 2023",
  },
  {
    company: "CHIANG SA",
    title: { es: "Ingeniero de Software", en: "Software Engineer" },
    date: "2023",
  },
  {
    company: "SV TECHNOLOGY S.A.",
    title: { es: "Dev Semi Senior Full-Stack", en: "Semi Senior Full-Stack Dev" },
    date: "2023",
  },
  {
    company: "EXPAUSA S.A.",
    title: { es: "Ingeniero I+D", en: "R&D Engineer" },
    date: "2023 – 2024",
  },
  {
    company: "Acatha S.A.",
    title: { es: "Desarrollador de Software", en: "Software Developer" },
    date: "2024 –",
  },
]

const interests = [
  { icon: "🔬", key: "tech" as const },
  { icon: "🌐", key: "opensource" as const },
  { icon: "🖥️", key: "homelab" as const },
  { icon: "📚", key: "learning" as const },
]

const techStack = [
  { label: "JavaScript", color: "#f7df1e", text: "#000" },
  { label: "TypeScript", color: "#3178c6", text: "#fff" },
  { label: "Python", color: "#3776ab", text: "#fff" },
  { label: "Java", color: "#ed8b00", text: "#fff" },
  { label: "PHP", color: "#777bb4", text: "#fff" },
  { label: "React", color: "#61dafb", text: "#000" },
  { label: "Next.js", color: "#1a1a1a", text: "#fff" },
  { label: "Vue.js", color: "#4fc08d", text: "#fff" },
  { label: "Laravel", color: "#ff2d20", text: "#fff" },
  { label: "NestJS", color: "#e0234e", text: "#fff" },
  { label: "FastAPI", color: "#009688", text: "#fff" },
  { label: "Node.js", color: "#339933", text: "#fff" },
  { label: "Docker", color: "#2496ed", text: "#fff" },
  { label: "MySQL", color: "#4479a1", text: "#fff" },
  { label: "PostgreSQL", color: "#336791", text: "#fff" },
  { label: "MongoDB", color: "#47a248", text: "#fff" },
  { label: "Linux", color: "#fcc624", text: "#000" },
  { label: "Ubuntu", color: "#e95420", text: "#fff" },
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
      <span
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--color-accent)",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
    </div>
  )
}

export default function HomePage() {
  const t = useTranslations("home")
  const locale = useLocale() as "es" | "en"

  return (
    <div style={{ position: "relative" }}>
      <div
        className="orb"
        style={{
          width: 600,
          height: 600,
          background: "var(--color-accent)",
          top: -160,
          right: -160,
          position: "fixed",
          zIndex: 0,
        }}
      />
      <div
        className="orb"
        style={{
          width: 400,
          height: 400,
          background: "#a855f7",
          top: "40%",
          left: -120,
          position: "fixed",
          zIndex: 0,
        }}
      />
      <div
        className="orb"
        style={{
          width: 300,
          height: 300,
          background: "#06b6d4",
          bottom: 0,
          right: "20%",
          position: "fixed",
          zIndex: 0,
        }}
      />
      <div className="noise-overlay" style={{ position: "fixed", zIndex: 0 }} />

      <section
        className="container-main"
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingTop: "3rem",
          paddingBottom: "4rem",
        }}
      >
        {siteConfig.AVAILABLE_FOR_WORK && (
          <div className="animate-fade-up" style={{ marginBottom: "1.75rem" }}>
            <span className="pill pill-green">
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--color-green)",
                  display: "inline-block",
                }}
              />
              {t("available")}
            </span>
          </div>
        )}

        <h1
          className="animate-fade-up animation-delay-100"
          style={{
            fontSize: "clamp(2.75rem, 7vw, 5rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            color: "var(--color-text-primary)",
            marginBottom: "1.25rem",
            maxWidth: 700,
          }}
        >
          {t("greeting")} <span style={{ color: "var(--color-accent)" }}>{t("name")}</span>
          <span style={{ color: "var(--color-text-tertiary)", fontWeight: 400 }}> 👋</span>
        </h1>

        <p
          className="animate-fade-up animation-delay-200"
          style={{
            fontSize: "clamp(1.05rem, 2vw, 1.35rem)",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "var(--color-text-primary)",
            marginBottom: "0.75rem",
            maxWidth: 560,
          }}
        >
          {t("tagline")}
        </p>

        <p
          className="animate-fade-up animation-delay-300"
          style={{
            fontSize: "1rem",
            lineHeight: 1.75,
            color: "var(--color-text-secondary)",
            maxWidth: 500,
            marginBottom: "2.5rem",
          }}
        >
          {t("description")}
        </p>

        <div
          className="animate-fade-up animation-delay-400"
          style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "4rem" }}
        >
          <Link href={`/${locale}/portfolio`} className="btn-primary">
            {t("cta_portfolio")}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href={`/${locale}/cv`} className="btn-secondary">
            {t("cta_cv")}
          </Link>
        </div>

        <div
          className="stats-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "0.875rem" }}
        >
          {[
            { value: "5+", label: t("stats_experience") },
            { value: "20+", label: t("stats_technologies") },
            { value: "4", label: t("stats_domains") },
            { value: "MSc", label: t("stats_degree") },
          ].map((s, i) => (
            <div
              key={i}
              className="card-apple"
              style={{
                padding: "1.1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  color: "var(--color-accent)",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.3,
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          background: "var(--color-bg)",
          paddingBottom: "6rem",
        }}
      >
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(to right, transparent, var(--color-border) 30%, var(--color-border) 70%, transparent)",
            marginBottom: "5rem",
          }}
        />

        <div className="container-main">
          <SectionLabel>{t("about_title")}</SectionLabel>

          <div
            className="about-intro-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "3rem",
              marginBottom: "5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                fontSize: "0.95rem",
                lineHeight: 1.8,
                color: "var(--color-text-secondary)",
              }}
            >
              <p>{t("description_1")}</p>
              <p>{t("description_2")}</p>
              <p>{t("description_3")}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { icon: "📍", text: "La Libertad, Santa Elena, Ecuador" },
                {
                  icon: "✉️",
                  text: "jhonnyalbert245@gmail.com",
                  href: "mailto:jhonnyalbert245@gmail.com",
                },
                {
                  icon: "💼",
                  text: "LinkedIn — sammy2455",
                  href: "https://www.linkedin.com/in/sammy2455/",
                },
                { icon: "🐙", text: "GitHub — sammy2455", href: "https://github.com/sammy2455" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="glass"
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-lg)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--color-accent)",
                        textDecoration: "none",
                      }}
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {item.text}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <SectionLabel>{t("journey_title")}</SectionLabel>

          <div
            className="journey-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "3rem",
              marginBottom: "5rem",
            }}
          >
            <div style={{ position: "relative", paddingLeft: "1.5rem" }}>
              <div className="timeline-line" />
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {timeline.map((item, i) => {
                  const isLast = i === timeline.length - 1
                  return (
                    <div key={i} style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          left: "-21px",
                          top: 6,
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          border: "2px solid",
                          background: isLast ? "var(--color-accent)" : "var(--color-bg)",
                          borderColor: isLast ? "var(--color-accent)" : "var(--color-border)",
                          boxShadow: isLast ? "0 0 0 3px var(--color-accent-soft)" : "none",
                          transition: "all 0.2s",
                        }}
                      />
                      <p
                        style={{
                          fontSize: "0.68rem",
                          color: "var(--color-text-tertiary)",
                          marginBottom: "0.1rem",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {item.date}
                      </p>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: isLast ? 600 : 500,
                          color: isLast ? "var(--color-text-primary)" : "var(--color-text-primary)",
                        }}
                      >
                        {item.title[locale]}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                        {item.company}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {interests.map(({ icon, key }) => (
                  <div
                    key={key}
                    className="card-apple"
                    style={{
                      padding: "1rem 1.25rem",
                      display: "flex",
                      gap: "1rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ fontSize: "1.35rem", lineHeight: 1, marginTop: 2 }}>{icon}</span>
                    <div>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "var(--color-text-primary)",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {t(`interests.${key}.title`)}
                      </p>
                      <p
                        style={{
                          fontSize: "0.78rem",
                          lineHeight: 1.6,
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {t(`interests.${key}.desc`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <SectionLabel>{t("tech_title")}</SectionLabel>

          <TechStack stack={techStack} />
        </div>
      </div>

      <style>{`
        @media (min-width: 640px)  { .stats-grid       { grid-template-columns: repeat(4,1fr); } }
        @media (min-width: 768px)  { .about-intro-grid { grid-template-columns: 3fr 2fr;       } }
        @media (min-width: 768px)  { .journey-grid     { grid-template-columns: 1fr 1fr;       } }
      `}</style>
    </div>
  )
}

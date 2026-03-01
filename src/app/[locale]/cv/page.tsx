import { useTranslations, useLocale } from "next-intl";
import { experiences } from "@/data/experience";
import { education, academicExperience } from "@/data/education";
import { skillGroups } from "@/data/skills";
import { CvContactButton } from "@/components/ui/CvContactButton";

// SVG icons inline
const IconBriefcase = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
  </svg>
);
const IconGradCap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);
const IconFlask = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11m0 0h10m-10 0H3m18-7v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-1" />
  </svg>
);
const IconCode = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);


export default function CvPage() {
  const t      = useTranslations("cv");
  const locale = useLocale() as "es" | "en";

  return (
    <div className="container-main" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBottom: "3rem",
        }}
      >
        <div>
          <p className="section-label">{t("title")}</p>
          <h1 className="section-title">
            Johnny{" "}
            <span style={{ color: "var(--color-accent)", fontWeight: 400 }}>
              Camatón Rendón
            </span>
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
            {locale === "es" ? "Ingeniero en TI · Máster en Ciberseguridad" : "IT Engineer · Master's in Cybersecurity"}
          </p>
        </div>
        <div>
          <CvContactButton locale={locale} label={t("download")} />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "3rem",
        }}
        className="cv-layout"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>

          <section>
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "var(--color-text-primary)",
                marginBottom: "1.5rem",
              }}
            >
              <span style={{ color: "var(--color-accent)" }}><IconBriefcase /></span>
              {t("experience_title")}
            </h2>

            <div style={{ position: "relative", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="timeline-line" />
              {experiences.map((exp, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "-21px",
                      top: "8px",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      border: "2px solid",
                      background: i === 0 ? "var(--color-accent)" : "var(--color-bg)",
                      borderColor: i === 0 ? "var(--color-accent)" : "var(--color-border)",
                    }}
                  />
                  <div className="card-apple" style={{ padding: "1.25rem" }}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div>
                        <h3 style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-text-primary)" }}>
                          {exp.title[locale]}
                        </h3>
                        <p style={{ fontSize: "0.75rem", marginTop: "0.15rem", color: "var(--color-text-secondary)" }}>
                          {exp.company} · {exp.location}
                        </p>
                      </div>
                      <span className="pill" style={{ color: "var(--color-text-tertiary)", fontSize: "0.7rem", flexShrink: 0, alignSelf: "flex-start" }}>
                        {exp.dates[locale]}
                      </span>
                    </div>
                    <ul style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                      {exp.bullets.map((b, j) => (
                        <li
                          key={j}
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            fontSize: "0.75rem",
                            lineHeight: 1.6,
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          <span
                            style={{
                              marginTop: "0.45rem",
                              width: "4px",
                              height: "4px",
                              borderRadius: "50%",
                              flexShrink: 0,
                              background: "var(--color-accent)",
                            }}
                          />
                          {b[locale]}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "var(--color-text-primary)",
                marginBottom: "1.5rem",
              }}
            >
              <span style={{ color: "var(--color-accent)" }}><IconGradCap /></span>
              {t("education_title")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {education.map((edu, i) => (
                <div
                  key={i}
                  className="card-apple"
                  style={{
                    padding: "1rem",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-primary)" }}>
                      {edu.title[locale]}
                    </p>
                    <p style={{ fontSize: "0.75rem", marginTop: "0.15rem", color: "var(--color-text-secondary)" }}>
                      {edu.institution}
                    </p>
                  </div>
                  <span className="pill" style={{ color: "var(--color-text-tertiary)", fontSize: "0.7rem", flexShrink: 0 }}>
                    {edu.dates}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "var(--color-text-primary)",
                marginBottom: "1.5rem",
              }}
            >
              <span style={{ color: "var(--color-accent)" }}><IconFlask /></span>
              {t("academic_title")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {academicExperience.map((item, i) => (
                <div
                  key={i}
                  className="card-apple"
                  style={{
                    padding: "1rem",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-primary)" }}>
                      {item.title[locale]}
                    </p>
                    <p style={{ fontSize: "0.75rem", marginTop: "0.15rem", color: "var(--color-text-secondary)" }}>
                      {item.institution}
                    </p>
                  </div>
                  <span className="pill" style={{ color: "var(--color-text-tertiary)", fontSize: "0.7rem", flexShrink: 0 }}>
                    {item.dates}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div>
          <div style={{ position: "sticky", top: "6rem" }}>
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "var(--color-text-primary)",
                marginBottom: "1.5rem",
              }}
            >
              <span style={{ color: "var(--color-accent)" }}><IconCode /></span>
              {t("skills_title")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {skillGroups.map((group, i) => (
                <div key={i}>
                  <p
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "var(--color-text-tertiary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {group.category[locale]}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                    {group.tags.map((tag) => (
                      <span key={tag} className="skill-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .cv-layout {
            grid-template-columns: 1fr 300px;
          }
        }
      `}</style>
    </div>
  );
}

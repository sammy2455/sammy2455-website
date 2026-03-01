"use client"

import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { projects, projectCategories } from "@/data/projects"

/* ─── Icons ──────────────────────────────────────────── */
const IconArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M7 7h10v10" />
  </svg>
)

const IconArticle = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)

/* ─── Placeholder cuando no hay imagen ──────────────── */
const ProjectPlaceholder = ({ category }: { category: string }) => (
  <div style={{
    width: "100%", height: "100%",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: "0.5rem",
    background: "linear-gradient(135deg, var(--color-accent-soft) 0%, var(--color-surface) 100%)",
  }}>
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ color: "var(--color-accent)", opacity: 0.5 }}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
    <span style={{
      fontSize: "0.65rem", color: "var(--color-accent)",
      fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
    }}>
      {category}
    </span>
  </div>
)

/* ─── Page ───────────────────────────────────────────── */
export default function PortfolioPage() {
  const t      = useTranslations("portfolio")
  const locale = useLocale() as "es" | "en"
  const router = useRouter()
  const [active, setActive] = useState("all")

  const filterAll  = t("filter_all")
  const categories = projectCategories(filterAll)
  const filtered   = active === "all" ? projects : projects.filter((p) => p.category === active)

  return (
    <div className="container-main" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>

      {/* Header */}
      <div style={{ maxWidth: 560, marginBottom: "2.5rem" }}>
        <p className="section-label">{t("title")}</p>
        <h1 className="section-title" style={{ marginBottom: "0.75rem" }}>{t("title")}</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>
          {t("subtitle")}
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
        {categories.map((cat) => {
          const isActive = active === cat || (active === "all" && cat === filterAll)
          return (
            <button
              key={cat}
              onClick={() => setActive(cat === filterAll ? "all" : cat)}
              className="pill"
              style={{
                cursor: "pointer", fontSize: "0.8rem",
                background:   isActive ? "var(--color-accent-soft)" : "var(--color-surface)",
                color:        isActive ? "var(--color-accent)"      : "var(--color-text-secondary)",
                borderColor:  isActive ? "transparent"              : "var(--color-border)",
                transition: "all 0.15s ease",
              }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "1.5rem",
      }}>
        {filtered.map((project) => (
          <div key={project.id} className="card-apple pf-card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>

            {/* Image */}
            <div style={{ position: "relative", height: 180, overflow: "hidden", background: "var(--color-surface)", flexShrink: 0 }}>
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title[locale]}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                />
              ) : (
                <ProjectPlaceholder category={project.category} />
              )}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.25), transparent)" }} />
              <span className="tech-tag" style={{
                position: "absolute", bottom: "0.75rem", left: "0.75rem",
                color: "#fff", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
              }}>
                {project.category}
              </span>

              {/* Badge "artículo relacionado" sobre la imagen */}
              {project.relatedPost && (
                <span style={{
                  position: "absolute", top: "0.75rem", right: "0.75rem",
                  display: "inline-flex", alignItems: "center", gap: "0.3rem",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "9999px",
                  fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.04em",
                  background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
                  color: "#fff", border: "1px solid rgba(255,255,255,0.15)",
                }}>
                  <IconArticle />
                  {locale === "es" ? "Artículo" : "Article"}
                </span>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0", flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--color-text-primary)", marginBottom: "0.2rem" }}>
                    {project.title[locale]}
                  </h3>
                  <p style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)" }}>
                    {project.subtitle[locale]}
                  </p>
                </div>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="glass"
                  title={t("visit")}
                  style={{
                    flexShrink: 0, width: 32, height: 32, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--color-text-secondary)", textDecoration: "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <IconArrow />
                </a>
              </div>

              <p style={{ fontSize: "0.78rem", lineHeight: 1.6, color: "var(--color-text-secondary)", marginBottom: "1rem", flex: 1 }}>
                {project.description[locale]}
              </p>

              {/* Tech tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: project.relatedPost ? "1rem" : 0 }}>
                {project.tech.map((tag) => (
                  <span key={tag} className="tech-tag">{tag}</span>
                ))}
              </div>

              {/* Enlace al artículo relacionado */}
              {project.relatedPost && (
                <button
                  onClick={() => router.push(`/${locale}/blog/${project.relatedPost}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    width: "100%",
                    padding: "0.625rem 0.875rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-accent-soft)",
                    color: "var(--color-accent)",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    marginTop: "auto",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "var(--color-accent)"
                    ;(e.currentTarget as HTMLElement).style.color = "#fff"
                    ;(e.currentTarget as HTMLElement).style.borderColor = "var(--color-accent)"
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "var(--color-accent-soft)"
                    ;(e.currentTarget as HTMLElement).style.color = "var(--color-accent)"
                    ;(e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)"
                  }}
                >
                  <IconArticle />
                  {t("read_article")}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ marginLeft: "auto" }}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .pf-card img { transition: transform 0.5s ease; }
        .pf-card:hover img { transform: scale(1.05); }
      `}</style>
    </div>
  )
}

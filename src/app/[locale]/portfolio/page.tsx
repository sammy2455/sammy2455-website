"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { projects, projectCategories } from "@/data/projects";

const IconArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M7 7h10v10" />
  </svg>
);

const ProjectPlaceholder = ({ category }: { category: string }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      background: "linear-gradient(135deg, var(--color-accent-soft) 0%, var(--color-surface) 100%)",
    }}
  >
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-accent)", opacity: 0.5 }}>
      <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
    </svg>
    <span style={{ fontSize: "0.65rem", color: "var(--color-accent)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
      {category}
    </span>
  </div>
);

export default function PortfolioPage() {
  const t      = useTranslations("portfolio");
  const locale = useLocale() as "es" | "en";
  const [active, setActive] = useState("all");

  const filterAll  = t("filter_all");
  const categories = projectCategories(filterAll);
  const filtered   = active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <div className="container-main" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{ maxWidth: 560, marginBottom: "2.5rem" }}>
        <p className="section-label">{t("title")}</p>
        <h1 className="section-title" style={{ marginBottom: "0.75rem" }}>{t("title")}</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>
          {t("subtitle")}
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
        {categories.map((cat) => {
          const isActive = active === cat || (active === "all" && cat === filterAll);
          return (
            <button
              key={cat}
              onClick={() => setActive(cat === filterAll ? "all" : cat)}
              className="pill"
              style={{
                cursor: "pointer",
                fontSize: "0.8rem",
                background:     isActive ? "var(--color-accent-soft)" : "var(--color-surface)",
                color:          isActive ? "var(--color-accent)"      : "var(--color-text-secondary)",
                borderColor:    isActive ? "transparent"              : "var(--color-border)",
                transition: "all 0.15s ease",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {filtered.map((project) => (
          <div key={project.id} className="card-apple pf-card" style={{ overflow: "hidden" }}>
            <div style={{ position: "relative", height: "180px", overflow: "hidden", background: "var(--color-surface)" }}>
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title[locale]}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <ProjectPlaceholder category={project.category} />
              )}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.25), transparent)" }} />
              <span
                className="tech-tag"
                style={{
                  position: "absolute",
                  bottom: "0.75rem",
                  left: "0.75rem",
                  color: "#fff",
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {project.category}
              </span>
            </div>

            <div style={{ padding: "1.25rem" }}>
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
                    flexShrink: 0,
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-text-secondary)",
                    transition: "all 0.15s ease",
                    textDecoration: "none",
                  }}
                >
                  <IconArrow />
                </a>
              </div>

              <p style={{ fontSize: "0.78rem", lineHeight: 1.6, color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
                {project.description[locale]}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                {project.tech.map((tag) => (
                  <span key={tag} className="tech-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .pf-card img { transition: transform 0.5s ease; }
        .pf-card:hover img { transform: scale(1.05); }
      `}</style>
    </div>
  );
}

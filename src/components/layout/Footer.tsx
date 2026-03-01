"use client"

import { useLocale } from "next-intl"
import Link from "next/link"
import { siteConfig } from "@/config/site"

const IconGithub = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const IconLinkedIn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const IconMail = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const IconHeart = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

export default function Footer() {
  const locale = useLocale()
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-border)",
        marginTop: "5rem",
      }}
    >
      <div className="container-main">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2rem",
            padding: "2.5rem 0",
            borderBottom: "1px solid var(--color-border)",
          }}
          className="footer-grid"
        >
          <div>
            <Link
              href={`/${locale}`}
              style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: "1px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "1.1rem",
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary)",
                marginBottom: "0.75rem",
              }}
            >
              sammy<span style={{ color: "var(--color-accent)" }}>2455</span>
            </Link>
            <p
              style={{
                fontSize: "0.8rem",
                lineHeight: 1.6,
                color: "var(--color-text-tertiary)",
                maxWidth: 240,
              }}
            >
              {locale === "es"
                ? "Ingeniero en TI apasionado por construir sistemas robustos y bien diseñados."
                : "IT Engineer passionate about building robust and well-designed systems."}
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-text-tertiary)",
                marginBottom: "0.875rem",
              }}
            >
              {locale === "es" ? "Navegación" : "Navigation"}
            </p>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { label: locale === "es" ? "Inicio" : "Home", href: `/${locale}` },
                { label: locale === "es" ? "CV" : "Resume", href: `/${locale}/cv` },
                { label: locale === "es" ? "Proyectos" : "Projects", href: `/${locale}/portfolio` },
                { label: locale === "es" ? "Blog" : "Blog", href: `/${locale}/blog` },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--color-text-secondary)",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-text-tertiary)",
                marginBottom: "0.875rem",
              }}
            >
              {locale === "es" ? "Contacto" : "Contact"}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.82rem",
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                }}
              >
                <IconGithub />
                github.com/sammy2455
              </a>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.82rem",
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                }}
              >
                <IconLinkedIn />
                linkedin.com/in/sammy2455
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.82rem",
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                }}
              >
                <IconMail />
                {siteConfig.email}
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            padding: "1.25rem 0",
          }}
        >
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.75rem",
              color: "var(--color-text-tertiary)",
            }}
          >
            {locale === "es" ? "Hecho con" : "Made with"}
            <span style={{ color: "#e74c3c" }}>
              <IconHeart />
            </span>
            {locale === "es" ? "por" : "by"}{" "}
            <span style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>
              Johnny Camatón
            </span>
            · {year}
          </p>

          <p style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)" }}>
            {locale === "es"
              ? "Construido con Next.js · Tailwind CSS · next-intl"
              : "Built with Next.js · Tailwind CSS · next-intl"}
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .footer-grid { grid-template-columns: 2fr 1fr 1fr; }
        }
      `}</style>
    </footer>
  )
}

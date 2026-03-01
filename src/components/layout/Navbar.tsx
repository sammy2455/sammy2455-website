"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { key: "home",      href: "/"          },
  { key: "cv",        href: "/cv"        },
  { key: "portfolio", href: "/portfolio" },
  { key: "blog",      href: "/blog"      },
] as const;

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);
const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);
const MenuIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export default function Navbar() {
  const t        = useTranslations("nav");
  const locale   = useLocale();
  const pathname = usePathname();
  const router   = useRouter();
  const { theme, toggle } = useTheme();

  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const localizedHref = (href: string) => `/${locale}${href === "/" ? "" : href}`;

  const isActive = (href: string) => {
    const full = localizedHref(href);
    return href === "/" ? pathname === full : pathname.startsWith(full);
  };

  const switchLocale = () => {
    const next         = locale === "es" ? "en" : "es";
    const withoutLocale = pathname.replace(/^\/(es|en)/, "");
    router.push(`/${next}${withoutLocale || "/"}`);
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        transition: "all 0.3s ease",
        ...(scrolled
          ? {
              background: "var(--color-surface)",
              backdropFilter: "blur(32px) saturate(180%)",
              WebkitBackdropFilter: "blur(32px) saturate(180%)",
              borderBottom: "1px solid var(--color-border)",
              boxShadow: "0 1px 24px rgba(0,0,0,0.06)",
            }
          : {
              background: "transparent",
            }),
      }}
    >
      <div className="container-main">
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

          <Link
            href={localizedHref("/")}
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "baseline",
              gap: "1px",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "-0.02em",
              color: "var(--color-text-primary)",
            }}
          >
            sammy<span style={{ color: "var(--color-accent)" }}>2455</span>
          </Link>

          <ul
            style={{
              display: "none",
              listStyle: "none",
              alignItems: "center",
              gap: "0.125rem",
            }}
            className="nav-desktop"
          >
            {NAV_LINKS.map(({ key, href }) => {
              const active = isActive(href);
              return (
                <li key={key}>
                  <Link
                    href={localizedHref(href)}
                    style={{
                      display: "inline-block",
                      padding: "0.375rem 0.875rem",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.875rem",
                      fontWeight: active ? 600 : 500,
                      textDecoration: "none",
                      transition: "all 0.15s ease",
                      background:  active ? "var(--color-accent-soft)" : "transparent",
                      color:       active ? "var(--color-accent)"      : "var(--color-text-secondary)",
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.background = "var(--color-surface)";
                        (e.currentTarget as HTMLElement).style.color      = "var(--color-text-primary)";
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color      = "var(--color-text-secondary)";
                      }
                    }}
                  >
                    {t(key)}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>

            <button
              onClick={switchLocale}
              aria-label="Switch language"
              style={{
                padding: "0.3rem 0.7rem",
                borderRadius: "9999px",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                backdropFilter: "blur(10px)",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                color: "var(--color-text-secondary)",
                cursor: "pointer",
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-accent)";
                (e.currentTarget as HTMLElement).style.color       = "var(--color-accent)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                (e.currentTarget as HTMLElement).style.color       = "var(--color-text-secondary)";
              }}
            >
              {locale === "es" ? "EN" : "ES"}
            </button>

            <button
              onClick={toggle}
              aria-label="Toggle theme"
              style={{
                width: 34, height: 34,
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "9999px",
                border: "1px solid transparent",
                background: "transparent",
                cursor: "pointer",
                color: "var(--color-text-secondary)",
                transition: "background 0.15s, color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background   = "var(--color-surface)";
                (e.currentTarget as HTMLElement).style.borderColor  = "var(--color-border)";
                (e.currentTarget as HTMLElement).style.color        = "var(--color-text-primary)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background   = "transparent";
                (e.currentTarget as HTMLElement).style.borderColor  = "transparent";
                (e.currentTarget as HTMLElement).style.color        = "var(--color-text-secondary)";
              }}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            <button
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
              className="nav-hamburger"
              style={{
                display: "none",
                width: 34, height: 34,
                alignItems: "center", justifyContent: "center",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                cursor: "pointer",
                color: "var(--color-text-secondary)",
              }}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </nav>
      </div>

      {menuOpen && (
        <div
          style={{
            background: "var(--color-surface)",
            backdropFilter: "blur(32px) saturate(180%)",
            WebkitBackdropFilter: "blur(32px) saturate(180%)",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <ul className="container-main" style={{ listStyle: "none", padding: "0.75rem 0", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {NAV_LINKS.map(({ key, href }) => {
              const active = isActive(href);
              return (
                <li key={key}>
                  <Link
                    href={localizedHref(href)}
                    style={{
                      display: "block",
                      padding: "0.625rem 0.875rem",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.9rem",
                      fontWeight: active ? 600 : 500,
                      textDecoration: "none",
                      background: active ? "var(--color-accent-soft)" : "transparent",
                      color:      active ? "var(--color-accent)"      : "var(--color-text-secondary)",
                    }}
                  >
                    {t(key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .nav-desktop    { display: flex !important; }
          .nav-hamburger  { display: none !important; }
        }
        @media (max-width: 767px) {
          .nav-hamburger  { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

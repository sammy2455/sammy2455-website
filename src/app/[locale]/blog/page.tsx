import { getTranslations, getLocale } from "next-intl/server"
import Link from "next/link"
import { getAllPosts } from "@/lib/blog"

export const dynamic = "force-dynamic"

export default async function BlogPage() {
  const t = await getTranslations("blog")
  const locale = await getLocale()
  const posts = getAllPosts(locale)

  return (
    <div className="container-main" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
      <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 3.5rem" }}>
        <p className="section-label">{t("title")}</p>
        <h1 className="section-title" style={{ marginBottom: "0.75rem" }}>
          {t("title")}
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", lineHeight: 1.75 }}>
          {t("subtitle")}
        </p>
      </div>

      {posts.length === 0 ? (
        <div
          className="card-apple"
          style={{
            maxWidth: 480,
            margin: "0 auto",
            padding: "3.5rem 2rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✍️</div>
          <p
            style={{
              fontWeight: 600,
              color: "var(--color-text-primary)",
              marginBottom: "0.5rem",
              fontSize: "0.95rem",
            }}
          >
            {t("empty")}
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--color-text-tertiary)", lineHeight: 1.6 }}>
            {t("empty_hint")}
          </p>
          <div
            className="glass"
            style={{
              marginTop: "1.5rem",
              padding: "0.875rem 1rem",
              borderRadius: "var(--radius-md)",
              textAlign: "left",
            }}
          >
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "var(--color-accent)",
                marginBottom: "0.4rem",
                letterSpacing: "0.06em",
              }}
            >
              EXAMPLE — content/blog/my-post.md
            </p>
            <pre
              style={{
                fontSize: "0.72rem",
                lineHeight: 1.6,
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-mono)",
                margin: 0,
                whiteSpace: "pre-wrap",
              }}
            >{`---\ntitle: "Mi primer artículo"\ndate: "2025-03-01"\ntags: ["DevOps", "Docker"]\ndescription: "Descripción corta"\n---\n\nContenido en Markdown...`}</pre>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div
            className="blog-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}
          >
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/${locale}/blog/${post.slug}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  className="card-apple blog-card"
                  style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
                >
                  {post.cover && (
                    <div
                      style={{
                        height: 180,
                        overflow: "hidden",
                        position: "relative",
                        background: "var(--color-surface)",
                      }}
                    >
                      <img
                        src={post.cover}
                        alt={post.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.5s ease",
                        }}
                        className="blog-cover-img"
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(to top, rgba(0,0,0,0.25), transparent)",
                        }}
                      />
                    </div>
                  )}

                  <div
                    style={{
                      padding: "1.5rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      flex: 1,
                    }}
                  >
                    {post.tags.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="tech-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h2
                      className="blog-title"
                      style={{
                        fontWeight: 700,
                        fontSize: "1rem",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.35,
                        color: "var(--color-text-primary)",
                        transition: "color 0.15s ease",
                      }}
                    >
                      {post.title}
                    </h2>

                    <p
                      style={{
                        fontSize: "0.82rem",
                        lineHeight: 1.65,
                        color: "var(--color-text-secondary)",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {post.description}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "0.5rem",
                        paddingTop: "0.75rem",
                        borderTop: "1px solid var(--color-border)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {post.date && (
                          <span
                            style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)" }}
                          >
                            {new Date(post.date).toLocaleDateString(
                              locale === "es" ? "es-EC" : "en-US",
                              { year: "numeric", month: "short", day: "numeric" }
                            )}
                          </span>
                        )}
                        <span style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)" }}>
                          ·
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)" }}>
                          {post.readingTime}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          color: "var(--color-accent)",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        {t("read_more")}
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 640px) { .blog-grid { grid-template-columns: repeat(2, 1fr); } }
        .blog-card:hover .blog-cover-img { transform: scale(1.04); }
        .blog-card:hover .blog-title { color: var(--color-accent); }
      `}</style>
    </div>
  )
}

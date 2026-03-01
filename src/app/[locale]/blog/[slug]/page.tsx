import { notFound } from "next/navigation"
import Link from "next/link"
import { MDXRemote } from "next-mdx-remote/rsc"
import { getPostBySlug, getAllPosts } from "@/lib/blog"
import { getTranslations } from "next-intl/server"
import { ReadingProgress } from "@/components/ui/ReadingProgress"

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts("es")
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params
  const post = getPostBySlug(slug, locale)
  if (!post) return {}
  return {
    title: `${post.title} — sammy2455`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      ...(post.cover && { images: [post.cover] }),
    },
  }
}

const IconBack = () => (
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
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)
const IconCal = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)
const IconClock = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)
const IconShare = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
  </svg>
)

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params
  const post = getPostBySlug(slug, locale)
  const t = await getTranslations("blog")

  if (!post) notFound()

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString(locale === "es" ? "es-EC" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  const shareUrl = `https://sammy2455.dev/${locale}/blog/${slug}`

  return (
    <>
      <ReadingProgress />

      <article style={{ paddingBottom: "6rem" }}>
        {post.cover ? (
          <div style={{ position: "relative", marginBottom: 0 }}>
            <div
              style={{
                width: "100%",
                height: "clamp(260px, 45vw, 520px)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={post.cover}
                alt={post.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.1) 100%)",
                }}
              />

              <div style={{ position: "absolute", top: "1.5rem", left: 0, right: 0 }}>
                <div className="container-main">
                  <Link
                    href={`/${locale}/blog`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.85)",
                      textDecoration: "none",
                      padding: "0.375rem 0.75rem 0.375rem 0.5rem",
                      borderRadius: "9999px",
                      background: "rgba(0,0,0,0.3)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      transition: "background 0.15s",
                    }}
                  >
                    <IconBack /> {t("back")}
                  </Link>
                </div>
              </div>

              <div
                style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "2rem 0" }}
              >
                <div className="container-main" style={{ maxWidth: 800 }}>
                  {post.tags.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.4rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            padding: "0.2rem 0.65rem",
                            borderRadius: "9999px",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            background: "rgba(255,255,255,0.12)",
                            backdropFilter: "blur(8px)",
                            color: "rgba(255,255,255,0.9)",
                            border: "1px solid rgba(255,255,255,0.2)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h1
                    style={{
                      fontSize: "clamp(1.6rem, 4vw, 2.75rem)",
                      fontWeight: 800,
                      letterSpacing: "-0.035em",
                      lineHeight: 1.12,
                      color: "#fff",
                      marginBottom: "1rem",
                      textShadow: "0 2px 16px rgba(0,0,0,0.4)",
                    }}
                  >
                    {post.title}
                  </h1>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.25rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {formattedDate && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          fontSize: "0.78rem",
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        <IconCal /> {formattedDate}
                      </span>
                    )}
                    <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        fontSize: "0.78rem",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      <IconClock /> {post.readingTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              paddingTop: "3rem",
              paddingBottom: "3rem",
              borderBottom: "1px solid var(--color-border)",
              marginBottom: "3rem",
            }}
          >
            <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 1.5rem" }}>
              <Link
                href={`/${locale}/blog`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                  padding: "0.375rem 0.75rem 0.375rem 0.5rem",
                  borderRadius: "9999px",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  marginBottom: "2rem",
                }}
              >
                <IconBack /> {t("back")}
              </Link>

              {post.tags.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.4rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {post.tags.map((tag) => (
                    <span key={tag} className="tech-tag" style={{ fontSize: "0.7rem" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h1
                style={{
                  fontSize: "clamp(1.875rem, 5vw, 2.875rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.1,
                  color: "var(--color-text-primary)",
                  marginBottom: "1.25rem",
                }}
              >
                {post.title}
              </h1>

              {post.description && (
                <p
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: 1.7,
                    color: "var(--color-text-secondary)",
                    marginBottom: "2rem",
                  }}
                >
                  {post.description}
                </p>
              )}

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "9999px",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {formattedDate && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      fontSize: "0.75rem",
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    <IconCal /> {formattedDate}
                  </span>
                )}
                <span style={{ width: 1, height: 10, background: "var(--color-border)" }} />
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.75rem",
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  <IconClock /> {post.readingTime}
                </span>
              </div>
            </div>
          </div>
        )}

        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 1.5rem" }}>
          {post.cover && (
            <div style={{ paddingTop: "2.5rem", marginBottom: "2.5rem" }}>
              {post.description && (
                <p
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: 1.75,
                    color: "var(--color-text-secondary)",
                    paddingBottom: "2.5rem",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  {post.description}
                </p>
              )}
            </div>
          )}

          <div className="prose-apple">
            <MDXRemote source={post.content} />
          </div>

          <div
            style={{
              height: 1,
              background:
                "linear-gradient(to right, transparent, var(--color-border) 30%, var(--color-border) 70%, transparent)",
              margin: "4rem 0",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "1.25rem",
              alignItems: "center",
              padding: "1.5rem",
              borderRadius: "var(--radius-xl)",
              background: "var(--color-surface)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--color-border)",
              marginBottom: "2.5rem",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--color-accent), #a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                flexShrink: 0,
                boxShadow: "0 0 0 3px var(--color-bg), 0 0 0 4px var(--color-border)",
              }}
            >
              👨‍💻
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  marginBottom: "0.25rem",
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "var(--color-text-primary)",
                  }}
                >
                  Johnny Camatón
                </span>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <a
                    href="https://www.linkedin.com/in/sammy2455/"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: "0.2rem 0.65rem",
                      borderRadius: "9999px",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      background: "var(--color-accent-soft)",
                      color: "var(--color-accent)",
                      textDecoration: "none",
                      border: "1px solid transparent",
                    }}
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/sammy2455"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: "0.2rem 0.65rem",
                      borderRadius: "9999px",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      background: "var(--color-surface)",
                      color: "var(--color-text-secondary)",
                      textDecoration: "none",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    GitHub
                  </a>
                </div>
              </div>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                {locale === "es"
                  ? "Ingeniero en TI · Máster en Ciberseguridad · Acatha S.A."
                  : "IT Engineer · Master's in Cybersecurity · Acatha S.A."}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <Link
              href={`/${locale}/blog`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.85rem",
                fontWeight: 500,
                color: "var(--color-text-secondary)",
                textDecoration: "none",
                padding: "0.5rem 1rem 0.5rem 0.75rem",
                borderRadius: "9999px",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                transition: "border-color 0.15s, color 0.15s",
              }}
            >
              <IconBack /> {t("back")}
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}>
                {locale === "es" ? "Compartir:" : "Share:"}
              </span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.375rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  background: "var(--color-surface)",
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                  border: "1px solid var(--color-border)",
                }}
              >
                <IconShare /> X / Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.375rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  background: "var(--color-accent-soft)",
                  color: "var(--color-accent)",
                  textDecoration: "none",
                  border: "1px solid transparent",
                }}
              >
                <IconShare /> LinkedIn
              </a>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}

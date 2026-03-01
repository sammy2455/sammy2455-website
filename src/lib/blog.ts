import fs from "fs"
import path from "path"
import matter from "gray-matter"
import readingTime from "reading-time"

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

export interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  cover?: string
  readingTime: string
  content: string
}

export interface BlogPostMeta extends Omit<BlogPost, "content"> {}

function ensureBlogDir(): boolean {
  return fs.existsSync(BLOG_DIR)
}

export function getAllPosts(locale: string = "es"): BlogPostMeta[] {
  if (!ensureBlogDir()) return []

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))

  return files
    .map((filename) => {
      const slug = filename.replace(/\.(md|mdx)$/, "")
      const filePath = path.join(BLOG_DIR, filename)
      const raw = fs.readFileSync(filePath, "utf-8")
      const { data, content } = matter(raw)

      const title = (locale === "en" ? data.title_en : data.title) ?? data.title ?? slug
      const description =
        (locale === "en" ? data.description_en : data.description) ?? data.description ?? ""

      return {
        slug,
        title,
        date: data.date ?? "",
        description,
        tags: data.tags ?? [],
        cover: data.cover,
        readingTime: readingTime(content).text,
      } satisfies BlogPostMeta
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string, locale: string = "es"): BlogPost | null {
  if (!ensureBlogDir()) return null

  const extensions = ["md", "mdx"]
  let filePath: string | null = null

  for (const ext of extensions) {
    const candidate = path.join(BLOG_DIR, `${slug}.${ext}`)
    if (fs.existsSync(candidate)) {
      filePath = candidate
      break
    }
  }

  if (!filePath) return null

  const raw = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(raw)

  const title = (locale === "en" ? data.title_en : data.title) ?? data.title ?? slug
  const description =
    (locale === "en" ? data.description_en : data.description) ?? data.description ?? ""

  return {
    slug,
    title,
    date: data.date ?? "",
    description,
    tags: data.tags ?? [],
    cover: data.cover,
    readingTime: readingTime(content).text,
    content,
  }
}

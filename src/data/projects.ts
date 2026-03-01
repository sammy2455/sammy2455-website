export interface Project {
  id: number
  title: { es: string; en: string }
  subtitle: { es: string; en: string }
  description: { es: string; en: string }
  image: string
  tech: string[]
  url: string
  category: string
  /**
   * Slug del artículo de blog relacionado (opcional).
   * Si se define, la card del portfolio muestra un enlace "Leer artículo".
   * Ejemplo: "emby-homelab-infraestructura-completa"
   */
  relatedPost?: string
}

export const projects: Project[] = [
  {
    id: 1,
    title: {
      es: "Emby — Servidor de media personal",
      en: "Emby — Personal media server",
    },
    subtitle: {
      es: "Linux · Administración de servidores",
      en: "Linux · Server administration",
    },
    description: {
      es: "Servidor de streaming desplegado en infraestructura propia: rack, servidor con GPU para transcoding, Ubuntu Server, red completa y acceso remoto seguro con dominio propio.",
      en: "Streaming server deployed on own infrastructure: rack, GPU server for transcoding, Ubuntu Server, full network stack and secure remote access with custom domain.",
    },
    image: "/assets/img/projects/project-1.png",
    tech: ["Linux", "Ubuntu Server", "Docker", "Nginx", "Emby"],
    url: "https://emby.devslab.cloud",
    category: "DevOps",
    relatedPost: "emby-homelab-infraestructura-completa",
  },
  {
    id: 2,
    title: {
      es: "HE-LLO — Plataforma web",
      en: "HE-LLO — Web platform",
    },
    subtitle: {
      es: "Full-stack · Back-end · DevOps",
      en: "Full-stack · Back-end · DevOps",
    },
    description: {
      es: "Plataforma multilenguaje configurada y desplegada en VPS con stack LEMP: Laravel + Vue.js containerizados en Docker, Nginx como reverse proxy y CI manual.",
      en: "Multilanguage platform configured and deployed on VPS with LEMP stack: Laravel + Vue.js containerized with Docker, Nginx as reverse proxy and manual CI.",
    },
    image: "/assets/img/projects/project-2.png",
    tech: ["Laravel", "PHP", "Vue.js", "Docker", "Nginx", "MySQL"],
    url: "https://www.he-llo.com/",
    category: "Full-stack",
    relatedPost: "hello-plataforma-multilenguaje-vps-laravel",
  },
]

export const projectCategories = (filterAll: string): string[] => [
  filterAll,
  ...Array.from(new Set(projects.map((p) => p.category))),
]

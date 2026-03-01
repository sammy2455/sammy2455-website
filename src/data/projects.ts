export interface Project {
  id: number
  title: { es: string; en: string }
  subtitle: { es: string; en: string }
  description: { es: string; en: string }
  image: string
  tech: string[]
  url: string
  category: string
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
      es: "Servidor de streaming de películas y series desplegado en infraestructura propia, con gestión de usuarios, transcoding y acceso remoto seguro.",
      en: "Movie and series streaming server deployed on own infrastructure, with user management, transcoding and secure remote access.",
    },
    image: "/assets/img/projects/project-1.png",
    tech: ["Linux", "Docker", "Nginx", "Emby"],
    url: "https://emby.devslab.cloud",
    category: "DevOps",
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
      es: "API REST escalable con Laravel para gestión de inventarios y facturación en la nube, containerizada con Docker en stack LEMP.",
      en: "Scalable REST API with Laravel for cloud inventory and invoicing management, containerized with Docker on LEMP stack.",
    },
    image: "/assets/img/projects/project-2.png",
    tech: ["Laravel", "PHP", "Docker", "MySQL", "Vue.js"],
    url: "https://www.he-llo.com/",
    category: "Full-stack",
  },
]

export const projectCategories = (filterAll: string): string[] => [
  filterAll,
  ...Array.from(new Set(projects.map((p) => p.category))),
]

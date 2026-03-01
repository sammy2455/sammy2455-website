export interface SkillGroup {
    category: { es: string; en: string };
    tags: string[];
}

export const skillGroups: SkillGroup[] = [
    {
        category: {es: "Frontend", en: "Frontend"},
        tags: ["React", "Next.js", "Vue.js", "TypeScript", "React Native", "FlutterFlow", "HTML5", "CSS3"],
    },
    {
        category: {es: "Backend", en: "Backend"},
        tags: ["Laravel", "Node.js", "NestJS", "FastAPI", "Python", "Java", "PHP"],
    },
    {
        category: {es: "Base de datos", en: "Databases"},
        tags: ["MySQL", "PostgreSQL", "MongoDB", "Redis"],
    },
    {
        category: {es: "DevOps & Cloud", en: "DevOps & Cloud"},
        tags: ["Docker", "Amazon Lightsail", "Linux", "Ubuntu", "CI/CD", "New Relic"],
    },
    {
        category: {es: "IA & Visión", en: "AI & Vision"},
        tags: ["YOLOv7", "ROS2", "NVIDIA Jetson", "OpenCV", "Python C++"],
    },
    {
        category: {es: "Idiomas", en: "Languages"},
        tags: ["Español (Nativo)", "Inglés B2"],
    },
    {
        category: {es: "Soft Skills", en: "Soft Skills"},
        tags: ["Liderazgo", "Comunicación efectiva", "Trabajo en equipo", "Resiliencia", "Adaptabilidad"],
    },
];

export const technologies = [
    {src: "/assets/img/icons/javascript.svg", alt: "JavaScript"},
    {src: "/assets/img/icons/typescript.svg", alt: "TypeScript"},
    {src: "/assets/img/icons/python.svg", alt: "Python"},
    {src: "/assets/img/icons/java.svg", alt: "Java"},
    {src: "/assets/img/icons/php.svg", alt: "PHP"},
    {src: "/assets/img/icons/react.svg", alt: "React"},
    {src: "/assets/img/icons/nextjs.svg", alt: "Next.js"},
    {src: "/assets/img/icons/vue.svg", alt: "Vue.js"},
    {src: "/assets/img/icons/laravel.svg", alt: "Laravel"},
    {src: "/assets/img/icons/nestjs.svg", alt: "NestJS"},
    {src: "/assets/img/icons/fastapi.svg", alt: "FastAPI"},
    {src: "/assets/img/icons/nodejs.svg", alt: "Node.js"},
    {src: "/assets/img/icons/docker.svg", alt: "Docker"},
    {src: "/assets/img/icons/mysql.svg", alt: "MySQL"},
    {src: "/assets/img/icons/postgresql.svg", alt: "PostgreSQL"},
    {src: "/assets/img/icons/mongodb.svg", alt: "MongoDB"},
    {src: "/assets/img/icons/linux.svg", alt: "Linux"},
    {src: "/assets/img/icons/ubuntu.svg", alt: "Ubuntu"},
];

export interface Experience {
  title: { es: string; en: string };
  company: string;
  location: string;
  dates: { es: string; en: string };
  logo: string;
  bullets: { es: string; en: string }[];
}

export const experiences: Experience[] = [
  {
    title: { es: "Desarrollador de Software", en: "Software Developer" },
    company: "Acatha S.A.",
    location: "Cuenca, Azuay, Ecuador",
    dates: { es: "Oct 2024 – Actualidad", en: "Oct 2024 – Present" },
    logo: "/assets/img/companies/acatha.jpeg",
    bullets: [
      {
        es: "Desarrollo de nuevos módulos Frontend de DTE para sistema de facturación electrónica destinado a El Salvador.",
        en: "Development of new Frontend DTE modules for electronic invoicing system for El Salvador.",
      },
      {
        es: "Optimización de algoritmos de firmado de DTE con Java, migrando de Docker a OnPromise para mejorar rendimiento.",
        en: "Optimization of DTE signing algorithms with Java, migrating from Docker to OnPremise to improve performance.",
      },
      {
        es: "Desarrollo de aplicación móvil con React Native compatible con dispositivos antiguos y actuales.",
        en: "Mobile application development with React Native compatible with old and current devices.",
      },
    ],
  },
  {
    title: { es: "Ingeniero I+D – Líder en Software", en: "R&D Engineer – Software Lead" },
    company: "EXPORTADORA EURIFERA EXPAUSA S.A.",
    location: "Guayaquil, Guayas, Ecuador",
    dates: { es: "Nov 2023 – Ago 2024", en: "Nov 2023 – Aug 2024" },
    logo: "/assets/img/companies/expausa.jpeg",
    bullets: [
      {
        es: "Implementación de YOLOv7 con optimización Python→C++ logrando tiempos de inferencia mejorados en detección en tiempo real.",
        en: "Implementation of YOLOv7 with Python→C++ optimization achieving improved inference times in real-time detection.",
      },
      {
        es: "Desarrollo de paquetes ROS2 para procesamiento de imágenes en entornos industriales con cámaras Basler.",
        en: "Development of ROS2 packages for image processing in industrial environments with Basler cameras.",
      },
      {
        es: "Clasificación de rocas en plataforma NVIDIA Jetson AGX Orin con librerías especializadas.",
        en: "Rock classification on NVIDIA Jetson AGX Orin platform with specialized libraries.",
      },
      {
        es: "Diseño de interfaces HMI para monitoreo en tiempo real del consumo de corriente en operaciones mineras.",
        en: "HMI interface design for real-time monitoring of current consumption in mining operations.",
      },
    ],
  },
  {
    title: { es: "Desarrollador Semi Senior Full-Stack", en: "Semi Senior Full-Stack Developer" },
    company: "SV TECHNOLOGY S.A.",
    location: "Samborondón, Guayas, Ecuador",
    dates: { es: "Ago 2023 – Nov 2023", en: "Aug 2023 – Nov 2023" },
    logo: "/assets/img/companies/sv-technology.jpeg",
    bullets: [
      {
        es: "Módulo de Rendimiento con Laravel y Vue.js para cálculo automático de horas extras.",
        en: "Performance module with Laravel and Vue.js for automatic overtime calculation.",
      },
      {
        es: "Containerización de microservicios con Docker en Amazon Lightsail, reduciendo costos operativos.",
        en: "Microservices containerization with Docker on Amazon Lightsail, reducing operational costs.",
      },
      {
        es: "Integración de New Relic para monitoreo de microservicios PHP y Node.js.",
        en: "New Relic integration for PHP and Node.js microservices monitoring.",
      },
    ],
  },
  {
    title: { es: "Ingeniero de Software", en: "Software Engineer" },
    company: "CHIANG SA",
    location: "Guayaquil, Guayas, Ecuador",
    dates: { es: "Jun 2023 – Ago 2023", en: "Jun 2023 – Aug 2023" },
    logo: "/assets/img/companies/chiang.jpeg",
    bullets: [
      {
        es: "Automatización web con Selenium, Python y MongoDB para mensajería masiva en WhatsApp.",
        en: "Web automation with Selenium, Python and MongoDB for bulk WhatsApp messaging.",
      },
      {
        es: "CLI en Java para software de logística y frontend de digitalización de votos con Next.js.",
        en: "Java CLI for logistics software and vote digitization frontend with Next.js.",
      },
      {
        es: "Diseño de proyecto en FlutterFlow para aplicaciones web y móviles escalables.",
        en: "Project design in FlutterFlow for scalable web and mobile applications.",
      },
    ],
  },
  {
    title: { es: "Desarrollador Backend", en: "Backend Developer" },
    company: "HE-LLO S.A.",
    location: "La Libertad, Santa Elena, Ecuador",
    dates: { es: "Ene 2022 – Feb 2023", en: "Jan 2022 – Feb 2023" },
    logo: "/assets/img/companies/he-llo.jpeg",
    bullets: [
      {
        es: "API robusta con Laravel y Docker para sistema de inventarios y facturación en la nube (LEMP).",
        en: "Robust API with Laravel and Docker for cloud inventory and invoicing system (LEMP).",
      },
      {
        es: "Optimización de imágenes y administración proactiva de servidores con mejoras de seguridad.",
        en: "Image optimization and proactive server management with security improvements.",
      },
    ],
  },
  {
    title: { es: "Pasante de Sistemas", en: "Systems Intern" },
    company: "CLÍNICA SANTA MARTHA S.A.",
    location: "La Libertad, Santa Elena, Ecuador",
    dates: { es: "2018", en: "2018" },
    logo: "/assets/img/companies/clinica-santa-martha.jpeg",
    bullets: [
      {
        es: "Configuración de red y corrección de cableado para minimizar caídas del servicio.",
        en: "Network configuration and cabling correction to minimize service outages.",
      },
      {
        es: "Sistema de gestión de historias clínicas con stack LAMP.",
        en: "Medical record management system with LAMP stack.",
      },
    ],
  },
];

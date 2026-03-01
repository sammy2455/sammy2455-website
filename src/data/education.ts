export interface Education {
  title: { es: string; en: string };
  institution: string;
  location: string;
  dates: string;
}

export interface AcademicExperience {
  title: { es: string; en: string };
  institution: string;
  dates: string;
}

export const education: Education[] = [
  {
    title: { es: "Maestría en Ciberseguridad", en: "Master's in Cybersecurity" },
    institution: "Universidad Estatal Península de Santa Elena",
    location: "Santa Elena, Ecuador",
    dates: "Dic 2023 – 2024",
  },
  {
    title: { es: "Ingeniería en Tecnologías de la Información", en: "Bachelor's in Information Technologies" },
    institution: "Universidad Estatal Península de Santa Elena",
    location: "Santa Elena, Ecuador",
    dates: "Jun 2017 – Nov 2021",
  },
  {
    title: { es: "Bachiller en Aplicaciones Informáticas", en: "High School in Computer Applications" },
    institution: "Unidad Educativa Santa Ana de Cotacachi",
    location: "Las Golondrinas, Ecuador",
    dates: "2012 – 2017",
  },
];

export const academicExperience: AcademicExperience[] = [
  {
    title: { es: "Ayudante de Cátedra — Sistemas Operativos", en: "Teaching Assistant — Operating Systems" },
    institution: "Universidad Estatal Península de Santa Elena",
    dates: "Ago 2019 – Nov 2019",
  },
  {
    title: { es: "Líder de Grupo de Investigación TECED", en: "TECED Research Group Leader" },
    institution: "Universidad Estatal Península de Santa Elena",
    dates: "Ago 2018 – Nov 2022",
  },
];

"use client";

interface Props {
  locale: string;
  label: string;
}

const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export function CvContactButton({ locale, label }: Props) {
  const handleClick = () => {
    const msg = locale === "es"
      ? `🇪🇨 Por razones de seguridad en Ecuador, prefiero no compartir mi CV de forma pública.\n\nSi tienes una propuesta de trabajo o quieres conversar sobre una oportunidad, escríbeme directamente al correo:\n\n✉️  jhonnyalbert245@gmail.com\n\n¡Estaré encantado de atenderte!`
      : `🇪🇨 For security reasons in Ecuador, I prefer not to share my CV publicly.\n\nIf you have a job proposal or want to discuss an opportunity, please reach out directly by email:\n\n✉️  jhonnyalbert245@gmail.com\n\nI'll be happy to connect!`;

    alert(msg);
  };

  return (
    <button
      onClick={handleClick}
      className="btn-secondary"
      style={{ cursor: "pointer" }}
    >
      <IconMail />
      {label}
    </button>
  );
}

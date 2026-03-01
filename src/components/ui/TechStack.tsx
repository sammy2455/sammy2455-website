"use client";

interface Tech {
    label: string;
    color: string;
    text: string;
}

export function TechPill({tech}: { tech: Tech }) {
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.3rem 0.85rem",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.01em",
                background: tech.color,
                color: tech.text,
                boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                cursor: "default",
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.22)";
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.18)";
            }}
        >
      {tech.label}
    </span>
    );
}

export function TechStack({stack}: { stack: Tech[] }) {
    return (
        <div style={{display: "flex", flexWrap: "wrap", gap: "0.5rem"}}>
            {stack.map((tech) => (
                <TechPill key={tech.label} tech={tech}/>
            ))}
        </div>
    );
}

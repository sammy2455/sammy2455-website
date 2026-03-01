"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop    = window.scrollY;
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
      const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, pct));
    };

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        zIndex: 100,
        background: "var(--color-border)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, var(--color-accent), #a855f7)",
          transition: "width 0.1s ease",
          borderRadius: "0 2px 2px 0",
        }}
      />
    </div>
  );
}

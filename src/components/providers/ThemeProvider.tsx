"use client";

import {createContext, useContext, useEffect, useState} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
    theme: Theme;
    toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: "light",
    toggle: () => {
    },
});

export function ThemeProvider({children}: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("theme") as Theme | null;
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const resolved = stored ?? (prefersDark ? "dark" : "light");
        setTheme(resolved);
        document.documentElement.classList.toggle("dark", resolved === "dark");
        setMounted(true);
    }, []);

    const toggle = () => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        setTheme(next);
        localStorage.setItem("theme", next);
        document.documentElement.classList.toggle("dark", next === "dark");
    };

    return (
        <ThemeContext.Provider value={{theme, toggle}}>
            <div style={{visibility: mounted ? "visible" : "hidden"}}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);

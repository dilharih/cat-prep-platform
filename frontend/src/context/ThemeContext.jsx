import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", darkMode);
    root.classList.toggle("theme-dark", darkMode);
    root.style.colorScheme = darkMode ? "dark" : "light";

    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const value = useMemo(
    () => ({
      darkMode,
      toggleDarkMode: () => setDarkMode((previous) => !previous),
    }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

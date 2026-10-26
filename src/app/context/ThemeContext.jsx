"use client";

import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

const getFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem("theme");
    return value || "light";
  }
};

export const ThemeContextProvider = ({ children }) => {
  // Keep the first render deterministic on the server and client. Browser-only
  // storage is read after hydration to avoid a server/client markup mismatch.
  const [theme, setTheme] = useState("light");
  const [hydrated, setHydrated] = useState(false);

  const toggle = () => {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  };

  useEffect(() => {
    const storedTheme = getFromLocalStorage();
    if (storedTheme) {
      setTheme(storedTheme);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("theme", theme);
    }
  }, [hydrated, theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

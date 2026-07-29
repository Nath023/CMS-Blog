"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export type ColorTheme = "default" | "rose" | "blue" | "green" | "violet" | "orange";

interface ColorThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

export const ColorThemeContext = React.createContext<ColorThemeContextType | undefined>(undefined);

export function useColorTheme() {
  const context = React.useContext(ColorThemeContext);
  if (!context) {
    throw new Error("useColorTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [colorTheme, setColorThemeState] = React.useState<ColorTheme>("default");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("color-theme") as ColorTheme;
    if (storedTheme) {
      setColorThemeState(storedTheme);
    }
  }, []);

  const setColorTheme = React.useCallback((theme: ColorTheme) => {
    setColorThemeState(theme);
    localStorage.setItem("color-theme", theme);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.remove("theme-default", "theme-rose", "theme-blue", "theme-green", "theme-violet", "theme-orange");
    if (colorTheme !== "default") {
      root.classList.add(`theme-${colorTheme}`);
    }
  }, [colorTheme, mounted]);

  return (
    <NextThemesProvider {...props}>
      <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
        {children}
      </ColorThemeContext.Provider>
    </NextThemesProvider>
  )
}

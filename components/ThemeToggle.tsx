"use client"

import * as React from "react"
import { Moon, Sun, Palette, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { useColorTheme, ColorTheme } from "./theme-provider"

const COLOR_PRESETS: { name: string; value: ColorTheme; hex: string }[] = [
  { name: "Coral (Default)", value: "default", hex: "#FF6B6B" },
  { name: "Rose", value: "rose", hex: "#e11d48" },
  { name: "Blue", value: "blue", hex: "#3b82f6" },
  { name: "Green", value: "green", hex: "#10b981" },
  { name: "Violet", value: "violet", hex: "#8b5cf6" },
  { name: "Orange", value: "orange", hex: "#f97316" },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { colorTheme, setColorTheme } = useColorTheme()
  const [mounted, setMounted] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const popoverRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!mounted) {
    return (
      <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
        <span className="sr-only">Toggle theme</span>
      </button>
    )
  }

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300"
        aria-label="Toggle theme settings"
        aria-expanded={isOpen}
      >
        <Palette className="h-[1.2rem] w-[1.2rem] text-slate-900 dark:text-slate-100" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 shadow-lg outline-none animate-in fade-in zoom-in-95 duration-200">
          <div className="mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Mode</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-md border py-1.5 text-sm transition-colors ${theme === "light" ? "border-primary bg-primary/10 text-primary font-medium" : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              >
                <Sun className="h-4 w-4" /> Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-md border py-1.5 text-sm transition-colors ${theme === "dark" ? "border-primary bg-primary/10 text-primary font-medium" : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              >
                <Moon className="h-4 w-4" /> Dark
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Color Theme</h4>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setColorTheme(preset.value)}
                  className={`flex flex-col items-center gap-1.5 rounded-md p-1.5 transition-colors ${colorTheme === preset.value ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                >
                  <div className="relative flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: preset.hex }}>
                    {colorTheme === preset.value && (
                      <Check className="h-3 w-3 text-white drop-shadow-md" />
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">{preset.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { usePortfolio, type Language } from "@/context/portfolio-context"
import { cn } from "@/lib/utils"

export function LanguageSwitcher() {
  const { language, setLanguage } = usePortfolio()

  const languages: { code: Language; label: string }[] = [
    { code: "ko", label: "KO" },
    { code: "en", label: "EN" },
  ]

  return (
    <div className="flex items-center rounded-full border border-border bg-card/80 p-0.5 text-xs font-medium shadow-sm backdrop-blur-sm">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={cn(
            "rounded-full px-2.5 py-1 transition-all",
            language === lang.code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}

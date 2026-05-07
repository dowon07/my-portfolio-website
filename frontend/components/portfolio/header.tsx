"use client"

import { usePortfolio, translations } from "@/context/portfolio-context"
import { BGMPlayer } from "./bgm-player"
import { LanguageSwitcher } from "./language-switcher"
import Link from "next/link"
import { useState } from "react"
import { Menu, X, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Header() {
  const { data, t, isAdmin, isEditMode, setShowAdminModal } = usePortfolio()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLabels = data.navLabels || {
    gallery: translations.nav.gallery,
    about: translations.nav.about,
    notices: translations.nav.notices,
    contact: translations.nav.contact,
  }

  const navLinks = [
    { href: "#gallery", label: navLabels.gallery },
    { href: "#about", label: navLabels.about },
    { href: "#notices", label: navLabels.notices },
    { href: "#contact", label: navLabels.contact },
  ]

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors",
        isAdmin ? "bg-black text-white border-zinc-800" : "bg-background/80 border-border/50"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <div className="relative flex items-center">
            <Link href="/" className="group relative flex items-center gap-2">
              {data.logoImageURL ? (
                <img src={data.logoImageURL} alt="Logo" className="max-h-8 w-auto rounded-md object-contain" />
              ) : (
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-sm font-bold text-primary-foreground">CS</span>
                </div>
              )}
              <span className={cn("text-lg font-semibold tracking-tight", isAdmin ? "text-white" : "text-foreground")}>
                {t(data.siteName)}
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isAdmin ? "text-zinc-300 hover:text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t(link.label)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <div className="relative">
            <BGMPlayer />
          </div>
          {isAdmin && (
            <Button
              variant="outline"
              size="icon"
              className="size-9 rounded-full border-white/20 bg-black/50 text-white hover:bg-white hover:text-black"
              onClick={() => setShowAdminModal(true)}
            >
              <Settings className="size-4" />
              <span className="sr-only">Open Global Admin Modal</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "border-t border-border bg-background md:hidden",
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

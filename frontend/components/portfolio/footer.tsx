"use client"

import { useState } from "react"
import { usePortfolio, translations } from "@/context/portfolio-context"
import { Button } from "@/components/ui/button"
import { AdminLoginModal } from "./admin-login-modal"
import { Instagram, Twitter, Mail, Settings } from "lucide-react"

export function Footer() {
  const { data, t, isAdmin, setIsAdmin } = usePortfolio()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleAdminToggle = () => {
    if (isAdmin) {
      if (confirm(t({ ko: "로그아웃 하시겠습니까?", en: "Are you sure you want to log out?" }))) {
        setIsAdmin(false)
      }
    } else {
      setShowLoginModal(true)
    }
  }

  return (
    <>
      <footer id="contact" className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-2">
                {data.logoImageURL ? (
                  <img src={data.logoImageURL} alt="Logo" className="max-h-8 w-auto rounded-md object-contain" />
                ) : (
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                    <span className="text-sm font-bold text-primary-foreground">CS</span>
                  </div>
                )}
                <span className="text-lg font-semibold text-foreground">
                  {t(data.siteName)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t(data.tagline)}
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                {t(translations.footer.quickLinks)}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#gallery" className="hover:text-foreground">
                    {t(data.navLabels?.gallery || translations.nav.gallery)}
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-foreground">
                    {t(data.navLabels?.about || translations.nav.about)}
                  </a>
                </li>
                <li>
                  <a href="#notices" className="hover:text-foreground">
                    {t(data.navLabels?.notices || translations.nav.notices)}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                {t(translations.footer.connect)}
              </h3>
              <div className="flex flex-wrap gap-3">
                {data.snsLinks?.map((sns) => {
                  const hasUrl = Boolean(sns.url && sns.url.trim())
                  const isMailLink = sns.url.toLowerCase().startsWith('mailto:') || sns.platform.toLowerCase().includes('mail')
                  if (!hasUrl) return null // 숨김 처리

                  return (
                    <a
                      key={sns.id}
                      href={sns.url}
                      target={isMailLink ? undefined : "_blank"}
                      rel={isMailLink ? undefined : "noopener noreferrer"}
                      className="flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                      title={sns.platform}
                    >
                      {sns.platform.toLowerCase().includes('instagram') && <Instagram className="size-4" />}
                      {sns.platform.toLowerCase().includes('twitter') && <Twitter className="size-4" />}
                      {sns.platform.toLowerCase().includes('github') && <Settings className="size-4" />}
                      {isMailLink && <Mail className="size-4" />}
                      {/* Fallback layout incase icon is missing */}
                      {!['instagram', 'twitter', 'github', 'mail'].some(sub => sns.platform.toLowerCase().includes(sub)) && !isMailLink && (
                        <span className="text-xs font-bold">{sns.platform.charAt(0)}</span>
                      )}
                      <span className="sr-only">{sns.platform}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
            <p className="text-sm text-muted-foreground">
              {data.footerText ? t(data.footerText) : <>&copy; {new Date().getFullYear()} {t(data.siteName)}. {t(translations.footer.allRights)}</>}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAdminToggle}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="mr-2 size-4" />
              {isAdmin ? t({ ko: "관리자 로그아웃", en: "Admin Logout" }) : t(translations.footer.admin)}
            </Button>
          </div>
        </div>
      </footer>

      <AdminLoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
      />
    </>
  )
}

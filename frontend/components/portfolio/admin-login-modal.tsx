"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePortfolio, translations } from "@/context/portfolio-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Lock, AlertCircle } from "lucide-react"

interface AdminLoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminLoginModal({ open, onOpenChange }: AdminLoginModalProps) {
  const { data, adminPassword, setIsAdmin, setShowAdminModal, t } = usePortfolio()
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === adminPassword) {
      setIsAdmin(true)
      setShowAdminModal(true)
      setError(false)
      setPassword("")
      onOpenChange(false)
      // router.push("/admin")
    } else {
      setError(true)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="size-6 text-primary" />
          </div>
          <DialogTitle className="text-center">
            {t(translations.admin.login)}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t({ ko: "관리자 비밀번호를 입력하세요.", en: "Enter the admin password to access the dashboard." })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">{t(translations.admin.password)}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t(translations.admin.enterPassword)}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              className={error ? "border-destructive" : ""}
            />
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="size-4" />
                {t(translations.admin.incorrectPassword)}
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                onOpenChange(false)
                setPassword("")
                setError(false)
              }}
            >
              {t(translations.admin.cancel)}
            </Button>
            <Button type="submit" className="flex-1">
              {t(translations.admin.loginBtn)}
            </Button>
          </div>
        </form>
        <p className="text-center text-xs text-muted-foreground mt-4">
          Hint: {data.adminCredentials?.hint || "초기 비밀번호는 1234입니다."}
        </p>
      </DialogContent>
    </Dialog>
  )
}

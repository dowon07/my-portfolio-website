"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { PortfolioProvider, usePortfolio } from "@/context/portfolio-context"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

function AdminContent() {
  const { isAdmin } = usePortfolio()
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin) {
      router.push("/")
    }
  }, [isAdmin, router])

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    )
  }

  return <AdminDashboard />
}

export default function AdminPage() {
  return (
    <PortfolioProvider>
      <AdminContent />
    </PortfolioProvider>
  )
}

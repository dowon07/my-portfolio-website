"use client"

import { PortfolioProvider } from "@/context/portfolio-context"
import { Header } from "@/components/portfolio/header"
import { Footer } from "@/components/portfolio/footer"
import { GlobalAdminModal } from "@/components/portfolio/global-admin-modal"
import { ReactNode } from "react"
import { usePortfolio } from "@/context/portfolio-context"

function ModalWrapper() {
  const { isAdmin, showAdminModal } = usePortfolio()
  return (isAdmin && showAdminModal) ? <GlobalAdminModal /> : null
}

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <PortfolioProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <ModalWrapper />
      </div>
    </PortfolioProvider>
  )
}

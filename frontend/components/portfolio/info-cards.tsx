"use client"

import { usePortfolio } from "@/context/portfolio-context"
import { Card, CardContent } from "@/components/ui/card"
import { Palette, Users, Star } from "lucide-react"

const iconMap: Record<string, any> = {
  palette: Palette,
  users: Users,
  star: Star,
}

export function InfoCards() {
  const { data, t } = usePortfolio()

  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {data.aboutStats.map((stat) => {
            const Icon = iconMap[stat.iconType] || Star
            return (
              <Card
                key={stat.id}
                className="group relative border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
              >
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {t(stat.title)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t(stat.desc)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

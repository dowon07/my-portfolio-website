"use client"

import { usePortfolio, translations } from "@/context/portfolio-context"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, Bell, ArrowRight } from "lucide-react"
import Link from "next/link"

export function NoticeBoard() {
  const { data, t, language, isAdmin, isEditMode } = usePortfolio()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "ko" ? "ko-KR" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <section id="notices" className="relative py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Bell className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {t(translations.notices.title)}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t(translations.notices.subtitle)}
            </p>
          </div>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="divide-y divide-border/50 p-0">
            {data.notices.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">등록된 공지사항이 없습니다.</div>
            ) : (
              [...data.notices]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((notice, index) => (
                  <Link
                    key={notice.id}
                    href={`/notice?id=${notice.id}`}
                    className="group flex items-start gap-4 p-4 transition-colors hover:bg-secondary/30"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10">
                          {notice.category || "공지"}
                        </span>
                        <h3 className="font-medium text-foreground group-hover:text-primary truncate">
                          {t(notice.title)}
                        </h3>
                      </div>
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {t(notice.content)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="size-3.5" />
                        {formatDate(notice.date)}
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </Link>
                ))
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

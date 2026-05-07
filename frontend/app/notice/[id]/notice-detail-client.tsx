"use client"

import { defaultData, usePortfolio, translations } from "@/context/portfolio-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, Bell } from "lucide-react"
import Link from "next/link"

export default function NoticeDetailClient({ id }: { id: string }) {
  const { data, t, language } = usePortfolio()
  const notice = data.notices.find((n) => n.id === id) ?? defaultData.notices.find((n) => n.id === id)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "ko" ? "ko-KR" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!notice) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">
            {t({ ko: "공지를 찾을 수 없습니다", en: "Notice not found" })}
          </h1>
          <Link href="/#notices">
            <Button variant="outline">
              <ArrowLeft className="mr-2 size-4" />
              {t(translations.detail.backToNotices)}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const otherNotices = (data.notices.length > 0 ? data.notices : defaultData.notices).filter((n) => n.id !== notice.id).slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <Link href="/#notices">
        <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          {t(translations.detail.backToNotices)}
        </Button>
      </Link>

      <div className="mx-auto max-w-3xl">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="size-6 text-primary" />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                {formatDate(notice.date)}
              </div>
            </div>

            <h1 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
              {t(notice.title)}
            </h1>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {t(notice.content)}
              </p>

              {notice.link && (
                <div className="mt-6">
                  <a href={notice.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {t({ ko: "관련 링크 바로가기", en: "View Related Link" })}
                  </a>
                </div>
              )}

              <div className="mt-8 rounded-lg bg-secondary/30 p-6">
                <p className="text-muted-foreground">
                  {t({
                    ko: "더 자세한 문의 사항이 있으시면 연락처 페이지를 통해 연락해 주세요. 항상 감사합니다!",
                    en: "If you have any questions, please reach out through the contact page. Thank you for your continued support!",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {otherNotices.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-xl font-bold text-foreground">
              {t({ ko: "다른 공지사항", en: "Other Notices" })}
            </h2>
            <div className="space-y-4">
              {otherNotices.map((other) => (
                <Link key={other.id} href={`/notice?id=${other.id}`}>
                  <Card className="group border-border/50 transition-all hover:border-primary/30 hover:shadow-lg">
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary">
                          {t(other.title)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(other.date)}
                        </p>
                      </div>
                      <ArrowLeft className="size-4 rotate-180 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
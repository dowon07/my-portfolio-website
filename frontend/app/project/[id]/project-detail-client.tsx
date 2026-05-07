"use client"

import { defaultData, usePortfolio, translations } from "@/context/portfolio-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Tag, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ProjectDetailClient({ id }: { id: string }) {
  const { data, t } = usePortfolio()
  const project = data.projects.find((p) => p.id === id) ?? defaultData.projects.find((p) => p.id === id)

  if (!project) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">
            {t({ ko: "프로젝트를 찾을 수 없습니다", en: "Project not found" })}
          </h1>
          <Link href="/#gallery">
            <Button variant="outline">
              <ArrowLeft className="mr-2 size-4" />
              {t(translations.detail.backToGallery)}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const relatedProjects = data.projects
    .filter((p) => p.id !== project.id && p.category === project.category)
    .slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <Link href="/#gallery">
        <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          {t(translations.detail.backToGallery)}
        </Button>
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative aspect-square overflow-hidden rounded-xl md:aspect-video mb-6">
            <Image
              src={project.imageUrl}
              alt={t(project.title)}
              fill
              className="object-cover"
              priority
            />
          </div>

          {project.detailImages && project.detailImages.length > 0 && (
            <div className="space-y-6">
              {project.detailImages.map((imgUrl, i) => (
                <div key={i} className="relative aspect-video overflow-hidden rounded-xl">
                  <Image
                    src={imgUrl}
                    alt={`${t(project.title)} detail ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {project.detailText && (
            <div className="prose dark:prose-invert max-w-none text-foreground">
              <p className="whitespace-pre-wrap">{t(project.detailText)}</p>
            </div>
          )}
        </div>

        <div className="space-y-6 sticky top-24 self-start">
          <div>
            <Badge className="mb-3">{project.category}</Badge>
            <h1 className="mb-2 text-3xl font-bold text-foreground">
              {t(project.title)}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t(project.description)}
            </p>
          </div>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Tag className="size-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    {t(translations.detail.category)}
                  </div>
                  <div className="font-medium text-foreground">
                    {project.category}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="size-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    {t(translations.detail.date)}
                  </div>
                  <div className="font-medium text-foreground">2026</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {project.externalLink && (
            <a href={project.externalLink} target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button size="lg" className="w-full gap-2">
                <ExternalLink className="size-4" />
                {t({ ko: "웹툰 보러가기 (외부 링크)", en: "View Webtoon (External Link)" })}
              </Button>
            </a>
          )}
        </div>
      </div>

      {relatedProjects.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-xl font-bold text-foreground">
            {t(translations.detail.relatedWorks)}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProjects.map((related) => (
              <Link key={related.id} href={`/project?id=${related.id}`}>
                <Card className="group overflow-hidden border-border/50 transition-all hover:border-primary/30 hover:shadow-lg">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={related.imageUrl}
                      alt={t(related.title)}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">
                        {t(related.title)}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {related.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
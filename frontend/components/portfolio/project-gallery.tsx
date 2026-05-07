"use client"

import { useState } from "react"
import { usePortfolio, translations } from "@/context/portfolio-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const categoryKeys = ["all", "painting", "drawing", "illustration", "digitalArt", "photography"] as const
const categoryMap: Record<string, string> = {
  all: "All",
  painting: "Painting",
  drawing: "Drawing",
  illustration: "Illustration",
  digitalArt: "Digital Art",
  photography: "Photography",
}

export function ProjectGallery() {
  const { data, t, isAdmin, isEditMode } = usePortfolio()
  const settings = data.projectSettings || {
    title: { ko: "프로젝트 갤러리", en: "Project Gallery" },
    description: { ko: "창작 작품과 예술적 표현을 만나보세요", en: "Discover creative works and artistic expressions" },
    categories: ["전체", "회화", "드로잉", "일러스트", "디지털 아트", "사진"]
  }
  const [activeCategory, setActiveCategory] = useState(settings.categories[0])

  const filteredProjects =
    activeCategory === settings.categories[0]
      ? data.projects
      : data.projects.filter((p) => p.category === activeCategory)

  return (
    <section id="gallery" className="relative bg-secondary/20 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
            {t(settings.title)}
          </h2>
          <p className="text-muted-foreground">
            {t(settings.description)}
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {settings.categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {category}
            </button>
          ))}
        </div>
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">등록된 콘텐츠가 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Link key={project.id} href={`/project?id=${project.id}`}>
                <Card className="group relative cursor-pointer overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={project.imageUrl}
                      alt={t(project.title)}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                      <p className="mb-2 text-sm text-card">{t(project.description)}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-card/80">
                        {t(translations.gallery.viewDetails)}
                        <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">
                        {t(project.title)}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {project.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

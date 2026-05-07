"use client"

import { defaultData, usePortfolio, translations } from "@/context/portfolio-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ArtworkDetailClient({ id }: { id: string }) {
  const { data, t } = usePortfolio()
  const artwork = data.heroArtworks.find((a) => a.id === id) ?? defaultData.heroArtworks.find((a) => a.id === id)

  if (!artwork) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">
            {t({ ko: "작품을 찾을 수 없습니다", en: "Artwork not found" })}
          </h1>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 size-4" />
              {t(translations.detail.backToGallery)}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const relatedArtworks = (data.heroArtworks.length > 0 ? data.heroArtworks : defaultData.heroArtworks).filter((a) => a.id !== artwork.id).slice(0, 2)

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <Link href="/#gallery">
        <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          {t(translations.detail.backToGallery)}
        </Button>
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <Image
              src={artwork.imageUrl}
              alt={t(artwork.title)}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="space-y-6 sticky top-24 self-start">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">
              {t(artwork.title)}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t(artwork.description)}
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
                    {t({ ko: "메인 작품", en: "Featured Artwork" })}
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
        </div>
      </div>

      {relatedArtworks.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-xl font-bold text-foreground">
            {t(translations.detail.relatedWorks)}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {relatedArtworks.map((related) => (
              <Link key={related.id} href={`/artwork?id=${related.id}`}>
                <Card className="group overflow-hidden border-border/50 transition-all hover:border-primary/30 hover:shadow-lg">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={related.imageUrl}
                      alt={t(related.title)}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground">
                      {t(related.title)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t(related.description)}
                    </p>
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
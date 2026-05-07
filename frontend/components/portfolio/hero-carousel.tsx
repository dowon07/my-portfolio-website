"use client"

import { useEffect, useState } from "react"
import { usePortfolio } from "@/context/portfolio-context"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroCarousel() {
  const { data, t, isAdmin, isEditMode } = usePortfolio()
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  useEffect(() => {
    if (!api) return

    const interval = setInterval(() => {
      api.scrollNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [api])

  if (!data.heroArtworks || data.heroArtworks.length === 0) {
    return (
      <section className="relative w-full overflow-hidden bg-secondary/30">
        <div className="container mx-auto py-20 text-center">
          <p className="text-muted-foreground">등록된 콘텐츠가 없습니다.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative w-full overflow-hidden bg-secondary/30">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {data.heroArtworks.map((artwork) => (
            <CarouselItem key={artwork.id}>
              <div className="relative block">
                <Link href={`/artwork?id=${artwork.id}`}>
                  <div className="group relative aspect-[21/9] w-full cursor-pointer overflow-hidden">
                    <Image
                      src={artwork.imageUrl}
                      alt={t(artwork.title)}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                      <div className="container mx-auto">
                        <h2 className="mb-2 text-2xl font-bold text-foreground md:text-4xl">
                          {t(artwork.title)}
                        </h2>
                        <p className="mb-4 max-w-md text-sm text-muted-foreground md:text-base">
                          {t(artwork.description)}
                        </p>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="group/btn gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        >
                          {t({ ko: "자세히 보기", en: "View Details" })}
                          <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {data.heroArtworks.map((_, index) => (
          <button
            key={index}
            className={cn(
              "size-2 rounded-full transition-all duration-300",
              current === index
                ? "w-6 bg-primary"
                : "bg-foreground/30 hover:bg-foreground/50"
            )}
            onClick={() => api?.scrollTo(index)}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

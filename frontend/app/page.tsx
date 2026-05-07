"use client"

import { HeroCarousel } from "@/components/portfolio/hero-carousel"
import { InfoCards } from "@/components/portfolio/info-cards"
import { ProjectGallery } from "@/components/portfolio/project-gallery"
import { NoticeBoard } from "@/components/portfolio/notice-board"

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <InfoCards />
      <ProjectGallery />
      <NoticeBoard />
    </>
  )
}

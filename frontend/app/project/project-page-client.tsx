"use client"

import { useSearchParams } from "next/navigation"
import ProjectDetailClient from "./[id]/project-detail-client"

export default function ProjectPageClient() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-20">
        <p className="text-center text-muted-foreground">선택된 프로젝트가 없습니다.</p>
      </div>
    )
  }

  return <ProjectDetailClient id={id} />
}
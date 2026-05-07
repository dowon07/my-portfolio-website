"use client"

import { useSearchParams } from "next/navigation"
import ArtworkDetailClient from "./[id]/artwork-detail-client"

export default function ArtworkPageClient() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-20">
        <p className="text-center text-muted-foreground">선택된 작품이 없습니다.</p>
      </div>
    )
  }

  return <ArtworkDetailClient id={id} />
}
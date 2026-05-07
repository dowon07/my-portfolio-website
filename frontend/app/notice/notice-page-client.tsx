"use client"

import { useSearchParams } from "next/navigation"
import NoticeDetailClient from "./[id]/notice-detail-client"

export default function NoticePageClient() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-20">
        <p className="text-center text-muted-foreground">선택된 공지사항이 없습니다.</p>
      </div>
    )
  }

  return <NoticeDetailClient id={id} />
}
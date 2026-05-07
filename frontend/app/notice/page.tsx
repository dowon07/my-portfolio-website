import { Suspense } from "react"
import NoticePageClient from "./notice-page-client"

export default function NoticePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20"><p className="text-center text-muted-foreground">공지사항을 불러오는 중입니다.</p></div>}>
      <NoticePageClient />
    </Suspense>
  )
}
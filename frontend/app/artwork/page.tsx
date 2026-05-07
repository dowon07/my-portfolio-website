import { Suspense } from "react"
import ArtworkPageClient from "./artwork-page-client"

export default function ArtworkPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20"><p className="text-center text-muted-foreground">작품을 불러오는 중입니다.</p></div>}>
      <ArtworkPageClient />
    </Suspense>
  )
}
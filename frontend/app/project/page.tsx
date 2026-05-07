import { Suspense } from "react"
import ProjectPageClient from "./project-page-client"

export default function ProjectPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20"><p className="text-center text-muted-foreground">프로젝트를 불러오는 중입니다.</p></div>}>
      <ProjectPageClient />
    </Suspense>
  )
}
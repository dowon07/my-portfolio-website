import NoticeDetailClient from "./notice-detail-client"

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }]
}

export default function NoticeDetailPage({ params }: { params: { id: string } }) {
  return <NoticeDetailClient id={params.id} />
}

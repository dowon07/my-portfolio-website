import ArtworkDetailClient from "./artwork-detail-client"

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }]
}

export default function ArtworkDetailPage({ params }: { params: { id: string } }) {
  return <ArtworkDetailClient id={params.id} />
}

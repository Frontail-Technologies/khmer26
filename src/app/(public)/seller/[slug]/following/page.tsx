import { Suspense } from "react"
import { Container } from "@/components/layout/Container"
import { SellerConnections } from "@/features/sellers/components/seller-connections"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function SellerFollowingPage({ params }: PageProps) {
  const { slug } = await params
  return (
    <Container className="py-4 pb-14">
      <Suspense fallback={null}>
        <SellerConnections id={slug} initial="following" />
      </Suspense>
    </Container>
  )
}

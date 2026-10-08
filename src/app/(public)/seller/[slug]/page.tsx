import type { Metadata } from "next"
import { SellerProfileContent } from "@/features/sellers/components/seller-profile-content"
import { lookupSellerMeta } from "@/features/sellers/api/sellers.server"

interface SellerPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: SellerPageProps): Promise<Metadata> {
  const { slug } = await params
  const meta = await lookupSellerMeta(slug)

  if (!meta) {
    return { title: "Seller — Khmer26" }
  }

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      images: meta.imageUrl ? [{ url: meta.imageUrl }] : [],
    },
  }
}

export default async function SellerPage({ params }: SellerPageProps) {
  const { slug } = await params
  return <SellerProfileContent id={slug} />
}

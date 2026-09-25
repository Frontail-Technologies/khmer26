import { Container } from "@/components/layout/Container"
import { CategorySection } from "@/features/categories/components/category-section"
import { HomepageBanner } from "@/features/home/components/homepage-banner"
import { SellCtaBanner } from "@/features/home/components/sell-cta-banner"
import { ListingSection } from "@/features/listings/components/listing-section"
import { LatestListingsSection } from "@/features/listings/components/latest-listings-section"
import { DEMO_LISTINGS } from "@/features/listings/data/demo-listings"
import { LocationSection } from "@/features/locations/components/location-section"
import { Fire, Sparkle } from "@phosphor-icons/react/dist/ssr"

export default function HomePage() {
  const featuredListings = DEMO_LISTINGS.slice(0, 10)
  const trendingListings = DEMO_LISTINGS.slice(10, 20)
  const latestListings = [...DEMO_LISTINGS]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10)

  return (
    <Container>
      <div className="pb-16 md:pb-6">
        <CategorySection />

        <HomepageBanner />

        <ListingSection
          title="Featured Listings"
          icon={<Sparkle size={18} weight="fill" className="text-accent" />}
          listings={featuredListings}
          featured={true}
          viewAllHref="/search?filter=featured"
        />

        <ListingSection
          title="Trending Near You"
          icon={<Fire size={18} weight="fill" className="text-accent" />}
          listings={trendingListings}
          featured={false}
          viewAllHref="/search?sort=recent"
        />

        <LatestListingsSection listings={latestListings} />

        <LocationSection />

        <SellCtaBanner />
      </div>
    </Container>
  )
}

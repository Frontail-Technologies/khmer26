import { SectionHeader } from "@/components/shared/SectionHeader"
import { DEMO_LOCATIONS } from "@/features/locations/data/demo-locations"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"
import { LocationCard } from "./location-card"

export function LocationSection() {
  return (
    <section className="py-3 sm:py-4">
      <SectionHeader
        title="Browse by City"
        action={
          <Link
            href="/search"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            All locations
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        }
      />
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2.5">
        {DEMO_LOCATIONS.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
    </section>
  )
}

import { useTranslations } from "next-intl"
import { LocalizedText } from "@/components/i18n/localized-text"
import type { ListingDetail } from "../../api/listing-detail.api"
import { ListingSpecifications } from "./listing-specifications"
import { ListingDescription } from "./listing-description"
import { ListingContactNumbers } from "./listing-contact-numbers"
import { ListingLocation } from "./listing-location"
import { ListingActionRow } from "./listing-action-row"

/**
 * The one Description card: category/spec pairs, the description text, contact phones (same
 * reveal state as the seller card), location with a compact map, and Save / Report / Share.
 */
export function ListingInfoCard({ listing }: { listing: ListingDetail }) {
  const tGenerated = useTranslations("generated")
  const hasDescription = Boolean(listing.description?.trim())
  const contacts = listing.seller?.contacts ?? []

  return (
    <div className="space-y-3 rounded-md border border-border/70 bg-card p-3 md:space-y-4 md:p-4">
      <h2 className="text-sm font-bold uppercase tracking-wide text-foreground"><LocalizedText id="description" /></h2>

      <ListingSpecifications listing={listing} />

      {hasDescription && <ListingDescription description={listing.description} />}

      {contacts.length > 0 && (
        <section aria-label={tGenerated("contactPhones")} className="hidden space-y-1.5 md:block">
          <h3 className="text-xs font-bold text-foreground"><LocalizedText id="contactPhones" /></h3>
          <ListingContactNumbers listingId={listing.id} contacts={contacts} />
        </section>
      )}

      <ListingLocation location={listing.location} />

      <ListingActionRow listing={listing} />
    </div>
  )
}

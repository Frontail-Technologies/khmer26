"use client"

import Link from "next/link"
import { Globe } from "@phosphor-icons/react"
import { ContactNumbersView } from "@/features/listings/components/detail/listing-contact-numbers"
import type { SellerProfile } from "../api/sellers.api"
import { useSellerContactReveal } from "../hooks/use-seller-contact-reveal"
import { sellerProfileDisplayUrl } from "../lib/seller-url"

/**
 * Contact block of the seller header: the product-style profile address and the seller's public
 * numbers, masked until revealed through the backend (same reveal pattern as the listing page).
 */
export function SellerContacts({ seller }: { seller: SellerProfile }) {
  const reveal = useSellerContactReveal(seller.id)

  return (
    <div className="space-y-2">
      <Link
        href={`/seller/${seller.id}`}
        className="inline-flex max-w-full items-center gap-2 text-xs text-primary hover:underline sm:text-sm"
        aria-label={`Seller profile ${sellerProfileDisplayUrl(seller.id)}`}
      >
        <Globe size={16} className="shrink-0 text-muted-foreground" />
        <span className="truncate">{sellerProfileDisplayUrl(seller.id)}</span>
      </Link>

      {seller.contacts.length > 0 && <ContactNumbersView contacts={seller.contacts} state={reveal} />}
    </div>
  )
}

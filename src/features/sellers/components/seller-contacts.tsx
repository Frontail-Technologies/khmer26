"use client"

import { ContactNumbersView } from "@/features/listings/components/detail/listing-contact-numbers"
import type { SellerProfile } from "../api/sellers.api"
import { useSellerContactReveal } from "../hooks/use-seller-contact-reveal"

/**
 * The seller's public numbers, masked until revealed through the backend (same reveal pattern as
 * the listing page). The profile link itself is shared from the actions menu.
 */
export function SellerContacts({ seller }: { seller: SellerProfile }) {
  const reveal = useSellerContactReveal(seller.id)
  if (seller.contacts.length === 0) return null
  return <ContactNumbersView contacts={seller.contacts} state={reveal} />
}

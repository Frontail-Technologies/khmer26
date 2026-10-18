"use client"

import { useTranslations } from "next-intl"

import { Phone } from "@phosphor-icons/react"
import type { MaskedContact, PhoneCarrier, RevealedContact } from "../../api/listing-detail.api"
import { describeError } from "../../hooks/use-start-conversation"
import { useContactReveal } from "../../hooks/use-contact-reveal"
import { CARRIER_LABELS, formatPhone } from "../../lib/phone-format"

const CARRIER_STYLES: Record<Exclude<PhoneCarrier, "other">, string> = {
  smart: "bg-green-600 text-white",
  cellcard: "bg-orange-500 text-white",
  metfone: "bg-teal-600 text-white",
}

/** Icon mark for the seller-declared carrier; a neutral phone icon when none is known. */
function CarrierMark({ carrier }: { carrier: PhoneCarrier | null }) {
  if (carrier && carrier !== "other") {
    const label = CARRIER_LABELS[carrier]
    return (
      <span
        role="img"
        aria-label={label}
        title={label}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${CARRIER_STYLES[carrier]}`}
      >
        <Phone size={12} weight="fill" />
      </span>
    )
  }
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
      <Phone size={12} />
    </span>
  )
}

export interface ContactRevealState {
  revealed: RevealedContact[] | undefined
  isPending: boolean
  error: unknown
  reveal: () => void
}

/**
 * Masked numbers on a single row (wrapping only when there is no room) with a compact
 * "Show Phone Number" action. Used by both the seller card and the Contact Phones section; they
 * share one reveal state (see useContactReveal).
 */
export function ListingContactNumbers({
  listingId,
  contacts,
}: {
  listingId: string
  contacts: MaskedContact[]
}) {
  const state = useContactReveal(listingId)
  return <ContactNumbersView contacts={contacts} state={state} />
}

/** Presentation only: the caller decides where the reveal state comes from (listing or seller). */
export function ContactNumbersView({
  contacts,
  state,
}: {
  contacts: MaskedContact[]
  state: ContactRevealState
}) {
  const tGenerated = useTranslations("generated")
  const { revealed, isPending, error, reveal } = state
  if (contacts.length === 0) return null

  return (
    <div className="space-y-1.5">
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {contacts.map((c) => {
          const full = revealed?.find((r) => r.id === c.id)
          return (
            <li key={c.id} className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <CarrierMark carrier={c.carrier} />
              {full ? (
                <a href={`tel:${full.value}`} className="whitespace-nowrap text-primary hover:underline">
                  {formatPhone(full.value)}
                </a>
              ) : (
                <span className="whitespace-nowrap tabular-nums">{c.valueMasked}</span>
              )}
            </li>
          )
        })}
      </ul>

      {!revealed && (
        <div>
          <button
            type="button"
            onClick={reveal}
            disabled={isPending}
            className="cursor-pointer text-xs font-medium text-primary hover:underline disabled:cursor-default disabled:opacity-70 disabled:no-underline"
          >
            {isPending ? tGenerated("loading") : tGenerated("showPhoneNumber")}
          </button>
          {error !== null && error !== undefined && (
            <p role="alert" className="mt-1 text-xs font-medium text-destructive">
              {describeError(error, "Couldn't load the phone number. Please try again.")}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

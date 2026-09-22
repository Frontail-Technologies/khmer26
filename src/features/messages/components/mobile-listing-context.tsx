import Image from "next/image"
import Link from "next/link"
import { ArrowSquareOut } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import type { ConversationListing } from "../types"

interface MobileListingContextProps {
  listing: ConversationListing
}

export function MobileListingContext({ listing }: MobileListingContextProps) {
  const isSold = listing.status === "sold"

  return (
    <div className="md:hidden px-3 py-2 bg-muted/30 border-b border-border/60 flex items-center justify-between gap-2.5">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted border border-border/60 shrink-0">
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0">
          <span className="font-bold text-xs text-foreground truncate block leading-tight">
            {listing.title}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-black text-primary">
              ${listing.price.toLocaleString()} {listing.currency}
            </span>
            {isSold && (
              <Badge variant="outline" className="text-[9px] font-bold uppercase py-0 px-1 bg-muted text-muted-foreground">
                Sold
              </Badge>
            )}
          </div>
        </div>
      </div>

      <Link
        href={`/listing/${listing.slug}`}
        className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 shrink-0 bg-primary/10 px-2 py-1 rounded-lg"
      >
        <span>View</span>
        <ArrowSquareOut size={13} />
      </Link>
    </div>
  )
}

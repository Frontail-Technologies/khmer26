"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowSquareOut, Check, DotsThreeVertical, Eye, Storefront, X } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { SITE } from "@/lib/constants/site"
import type { AdminListing } from "../types"
import { useApproveListing } from "../hooks/listings.mutations"
import { RejectListingDialog } from "./reject-listing-dialog"

const NEEDS_DECISION = new Set(["pending", "flagged"])

/**
 * Row actions that do the job in place: Approve (one tap) and Reject (reason dialog) are visible
 * buttons for listings waiting on a decision; everything else lives in the ⋯ menu.
 */
export function ListingRowActions({ listing, layout = "row" }: { listing: AdminListing; layout?: "row" | "card" }) {
  const approve = useApproveListing()
  const [rejectOpen, setRejectOpen] = useState(false)
  const decide = NEEDS_DECISION.has(listing.status)
  const isPublic = listing.status === "active" && Boolean(listing.slug)
  const card = layout === "card"

  return (
    <div
      className={cn("flex items-center gap-1.5", card ? "w-full" : "justify-end")}
      onClick={(event) => event.stopPropagation()}
    >
      {decide && (
        <>
          <Button
            size="sm"
            onClick={() => approve.mutate(listing.id)}
            disabled={approve.isPending}
            className={cn(
              "h-8 gap-1 rounded-full bg-success px-3 text-xs font-bold text-success-foreground hover:bg-success/90",
              card && "h-9 flex-1"
            )}
          >
            <Check size={14} weight="bold" />
            {approve.isPending ? "Approving" : "Approve"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setRejectOpen(true)}
            className={cn(
              "h-8 gap-1 rounded-full border-destructive/30 px-3 text-xs font-bold text-destructive hover:bg-destructive/10 hover:text-destructive",
              card && "h-9 flex-1"
            )}
          >
            <X size={14} weight="bold" />
            Reject
          </Button>
        </>
      )}
      {!decide && (
        <Button
          size="sm"
          variant="outline"
          className={cn("h-8 gap-1 rounded-full px-3 text-xs font-semibold", card && "h-9 flex-1")}
          render={
            <Link href={`/listings/${listing.id}`}>
              <Eye size={14} />
              Open
            </Link>
          }
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              className={cn("size-8 rounded-full text-muted-foreground hover:text-foreground", card && "size-9 border border-border/70")}
              aria-label="More actions"
            >
              <DotsThreeVertical size={16} weight="bold" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-md">
          <DropdownMenuItem
            render={
              <Link href={`/listings/${listing.id}`} className="flex w-full items-center gap-2 text-xs font-medium">
                <Eye size={14} />
                <span>Full details</span>
              </Link>
            }
          />
          {(isPublic || listing.seller.slug) && <DropdownMenuSeparator />}
          {isPublic && (
            <DropdownMenuItem
              render={
                <Link href={`${SITE.url}/listing/${listing.slug}`} target="_blank" rel="noopener noreferrer" className="flex w-full items-center gap-2 text-xs font-medium">
                  <ArrowSquareOut size={14} />
                  <span>Public page</span>
                </Link>
              }
            />
          )}
          {listing.seller.slug && (
            <DropdownMenuItem
              render={
                <Link href={`${SITE.url}/seller/${listing.seller.slug}`} target="_blank" rel="noopener noreferrer" className="flex w-full items-center gap-2 text-xs font-medium">
                  <Storefront size={14} />
                  <span>Seller profile</span>
                </Link>
              }
            />
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {decide && <RejectListingDialog listing={listing} open={rejectOpen} onOpenChange={setRejectOpen} />}
    </div>
  )
}

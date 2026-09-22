"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Eye,
  Heart,
  ChatCircleDots,
  MapPin,
  CalendarBlank,
  DotsThreeVertical,
  PencilSimple,
  CheckCircle,
  Pause,
  Play,
  Sparkle,
  Trash,
  ArrowClockwise,
  ArrowSquareOut,
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ListingStatusBadge } from "./listing-status-badge"
import type { AccountListingItem, AccountListingStatus } from "../../types"

interface AccountListingCardProps {
  listing: AccountListingItem
  onStatusChange: (id: string, status: AccountListingStatus) => void
  onPromote: (listing: AccountListingItem) => void
  onDelete: (listing: AccountListingItem) => void
  onContinueEditingDraft: (listing: AccountListingItem) => void
}

export function AccountListingCard({
  listing,
  onStatusChange,
  onPromote,
  onDelete,
  onContinueEditingDraft,
}: AccountListingCardProps) {
  const formattedPrice = `$${Number(listing.price).toLocaleString()} ${listing.currency}`
  const createdDateFormatted = new Date(listing.createdAt).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  )

  return (
    <Card className="rounded-xl border border-border/80 bg-card overflow-hidden transition-all hover:border-border hover:shadow-2xs">
      <div className="flex flex-col sm:flex-row p-3.5 sm:p-4 gap-3.5 sm:gap-4 items-stretch sm:items-center">
        <div className="relative w-full sm:w-36 md:w-44 h-36 sm:h-28 rounded-lg overflow-hidden bg-muted shrink-0">
          {listing.imageUrl ? (
            <Image
              src={listing.imageUrl}
              alt={listing.title}
              fill
              sizes="(max-width: 640px) 100vw, 200px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-semibold">
              No Image
            </div>
          )}

          <div className="absolute top-2 left-2 sm:hidden">
            <ListingStatusBadge status={listing.status} />
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 min-w-0">
              <div className="hidden sm:inline-flex mb-1">
                <ListingStatusBadge status={listing.status} />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug line-clamp-1">
                {listing.title}
              </h3>
            </div>

            <div className="text-right shrink-0">
              <span className="text-base sm:text-lg font-black text-primary block">
                {formattedPrice}
              </span>
              {listing.negotiable && (
                <span className="text-[10px] text-muted-foreground font-semibold">
                  Negotiable
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 truncate">
              <MapPin size={13} className="text-primary shrink-0" />
              <span>{listing.location.label}</span>
            </span>

            <span className="inline-flex items-center gap-1">
              <CalendarBlank size={13} className="shrink-0" />
              <span>{createdDateFormatted}</span>
            </span>

            <span className="truncate max-w-30 sm:max-w-none text-muted-foreground/80">
              {listing.categoryName}
            </span>
          </div>

          <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
              <span
                className="inline-flex items-center gap-1"
                title={`${listing.viewsCount.toLocaleString()} views`}
              >
                <Eye size={14} className="text-foreground/70" />
                <span className="font-semibold text-foreground">
                  {listing.viewsCount.toLocaleString()}
                </span>
                <span className="hidden xs:inline text-[11px]">views</span>
              </span>

              <span
                className="inline-flex items-center gap-1"
                title={`${listing.favoritesCount} favorites`}
              >
                <Heart size={14} className="text-rose-500" />
                <span className="font-semibold text-foreground">
                  {listing.favoritesCount}
                </span>
                <span className="hidden xs:inline text-[11px]">favorites</span>
              </span>

              <span
                className="inline-flex items-center gap-1"
                title={`${listing.messagesCount} messages`}
              >
                <ChatCircleDots size={14} className="text-primary" />
                <span className="font-semibold text-foreground">
                  {listing.messagesCount}
                </span>
                <span className="hidden xs:inline text-[11px]">messages</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              {listing.status === "active" && (
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => onPromote(listing)}
                  className="h-8 px-2.5 text-xs font-semibold gap-1 text-accent border-accent/30 hover:bg-accent/10"
                >
                  <Sparkle size={14} weight="fill" />
                  <span>Promote</span>
                </Button>
              )}

              {listing.status === "draft" && (
                <Button
                  size="xs"
                  onClick={() => onContinueEditingDraft(listing)}
                  className="h-8 px-3 text-xs font-bold gap-1 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <PencilSimple size={14} weight="bold" />
                  <span>Continue Editing</span>
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Listing actions"
                      className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                    >
                      <DotsThreeVertical size={18} weight="bold" />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-48">
                  {listing.status === "active" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(listing.id, "sold")}
                        className="gap-2 text-xs font-medium cursor-pointer"
                      >
                        <CheckCircle size={15} />
                        <span>Mark as Sold</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onStatusChange(listing.id, "paused")}
                        className="gap-2 text-xs font-medium cursor-pointer"
                      >
                        <Pause size={15} />
                        <span>Pause Listing</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        render={
                          <Link
                            href={`/listing/${listing.slug}`}
                            className="flex items-center gap-2 text-xs font-medium w-full"
                          >
                            <ArrowSquareOut size={15} />
                            <span>View Public Listing</span>
                          </Link>
                        }
                      />

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => onDelete(listing)}
                        className="gap-2 text-xs font-medium text-destructive cursor-pointer"
                      >
                        <Trash size={15} />
                        <span>Delete Listing</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  {listing.status === "pending" && (
                    <>
                      <DropdownMenuItem
                        render={
                          <Link
                            href={`/listing/${listing.slug}`}
                            className="flex items-center gap-2 text-xs font-medium w-full"
                          >
                            <ArrowSquareOut size={15} />
                            <span>Preview Listing</span>
                          </Link>
                        }
                      />

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => onDelete(listing)}
                        className="gap-2 text-xs font-medium text-destructive cursor-pointer"
                      >
                        <Trash size={15} />
                        <span>Delete Listing</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  {listing.status === "sold" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(listing.id, "active")}
                        className="gap-2 text-xs font-medium cursor-pointer"
                      >
                        <ArrowClockwise size={15} />
                        <span>Relist Item</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        render={
                          <Link
                            href={`/listing/${listing.slug}`}
                            className="flex items-center gap-2 text-xs font-medium w-full"
                          >
                            <ArrowSquareOut size={15} />
                            <span>View Sold Listing</span>
                          </Link>
                        }
                      />

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => onDelete(listing)}
                        className="gap-2 text-xs font-medium text-destructive cursor-pointer"
                      >
                        <Trash size={15} />
                        <span>Delete Listing</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  {listing.status === "draft" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => onContinueEditingDraft(listing)}
                        className="gap-2 text-xs font-medium cursor-pointer"
                      >
                        <PencilSimple size={15} />
                        <span>Edit Draft</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => onDelete(listing)}
                        className="gap-2 text-xs font-medium text-destructive cursor-pointer"
                      >
                        <Trash size={15} />
                        <span>Delete Draft</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  {listing.status === "expired" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(listing.id, "active")}
                        className="gap-2 text-xs font-medium cursor-pointer"
                      >
                        <ArrowClockwise size={15} />
                        <span>Renew & Relist</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => onDelete(listing)}
                        className="gap-2 text-xs font-medium text-destructive cursor-pointer"
                      >
                        <Trash size={15} />
                        <span>Delete Listing</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  {listing.status === "paused" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(listing.id, "active")}
                        className="gap-2 text-xs font-medium cursor-pointer"
                      >
                        <Play size={15} />
                        <span>Reactivate Listing</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => onDelete(listing)}
                        className="gap-2 text-xs font-medium text-destructive cursor-pointer"
                      >
                        <Trash size={15} />
                        <span>Delete Listing</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

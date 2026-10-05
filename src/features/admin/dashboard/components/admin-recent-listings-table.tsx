"use client"

import { useState } from "react"
import Link from "next/link"
import {
  CaretRight,
  Car,
  House,
  DeviceMobile,
  DotsThreeVertical,
  CaretUp,
  CaretDown,
  CaretUpDown,
} from "@phosphor-icons/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAdminDashboard } from "../hooks/dashboard.queries"

type SortField = "title" | "price" | "status" | "createdAt"
type SortOrder = "asc" | "desc" | null

export function AdminRecentListingsTable() {
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)
  const { data } = useAdminDashboard()
  const listings = data?.recentListings ?? []

  const handleSort = (field: SortField) => {
    if (sortField !== field) {
      setSortField(field)
      setSortOrder("asc")
    } else if (sortOrder === "asc") {
      setSortOrder("desc")
    } else {
      setSortField(null)
      setSortOrder(null)
    }
  }

  const sortedListings = [...listings].sort((a, b) => {
    if (!sortField || !sortOrder) return 0
    if (sortField === "price") {
      const priceA = Number(a.price ?? 0)
      const priceB = Number(b.price ?? 0)
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA
    }
    if (sortField === "title") {
      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    }
    if (sortField === "status") {
      return sortOrder === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status)
    }
    return sortOrder === "asc"
      ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const formatPrice = (price: string | null, currency: "USD" | "KHR" | null) => {
    if (!price || !currency) return "Not set"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "KHR" ? 0 : 2,
    }).format(Number(price))
  }

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(value))

  return (
    <Card className="rounded-xl border-0 bg-card p-0 shadow-2xs overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3 flex flex-row items-center justify-between border-b border-border/60">
        <div className="space-y-0.5">
          <CardTitle className="text-sm sm:text-base font-bold text-foreground">
            Recent Listings
          </CardTitle>
        </div>

        <Link
          href="/admin/listings"
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>View All</span>
          <CaretRight size={12} weight="bold" />
        </Link>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 dark:bg-muted/90 text-muted-foreground dark:text-foreground/80 border-b border-border/80 select-none">
              <tr>
                <th className="py-3 px-5 font-bold text-[10px] uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => handleSort("title")}
                    className="inline-flex items-center gap-1 hover:text-foreground cursor-pointer font-bold"
                  >
                    <span>Listing</span>
                    {sortField === "title" ? (
                      sortOrder === "asc" ? (
                        <CaretUp size={12} weight="bold" className="text-primary" />
                      ) : (
                        <CaretDown size={12} weight="bold" className="text-primary" />
                      )
                    ) : (
                      <CaretUpDown size={12} className="text-muted-foreground/60" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3 font-bold text-[10px] uppercase tracking-wider">Seller</th>
                <th className="py-3 px-3 font-bold text-[10px] uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => handleSort("price")}
                    className="inline-flex items-center gap-1 hover:text-foreground cursor-pointer font-bold"
                  >
                    <span>Price</span>
                    {sortField === "price" ? (
                      sortOrder === "asc" ? (
                        <CaretUp size={12} weight="bold" className="text-primary" />
                      ) : (
                        <CaretDown size={12} weight="bold" className="text-primary" />
                      )
                    ) : (
                      <CaretUpDown size={12} className="text-muted-foreground/60" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3 font-bold text-[10px] uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => handleSort("status")}
                    className="inline-flex items-center gap-1 hover:text-foreground cursor-pointer font-bold"
                  >
                    <span>Status</span>
                    {sortField === "status" ? (
                      sortOrder === "asc" ? (
                        <CaretUp size={12} weight="bold" className="text-primary" />
                      ) : (
                        <CaretDown size={12} weight="bold" className="text-primary" />
                      )
                    ) : (
                      <CaretUpDown size={12} className="text-muted-foreground/60" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3 font-bold text-[10px] uppercase tracking-wider">Submitted</th>
                <th className="py-3 px-5 font-bold text-[10px] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {sortedListings.map((listing) => {
                const isActive = listing.status === "active"
                const isPending = listing.moderationStatus === "pending_review"
                const statusLabel = isPending ? "pending" : listing.moderationStatus === "rejected" ? "rejected" : listing.status

                return (
                  <tr key={listing.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-9 rounded-xl bg-muted/60 border border-border/60 flex items-center justify-center shrink-0 text-muted-foreground">
                          {listing.categoryName === "Vehicles" || listing.categoryName === "Motorcycles" ? (
                            <Car size={18} weight="duotone" />
                          ) : listing.categoryName === "Properties" ? (
                            <House size={18} weight="duotone" />
                          ) : (
                            <DeviceMobile size={18} weight="duotone" />
                          )}
                        </div>
                        <div className="min-w-0 max-w-44 sm:max-w-56 space-y-0.5">
                          <Link
                            href={`/admin/listings/${listing.id}`}
                            className="font-bold text-foreground hover:text-primary transition-colors truncate block"
                          >
                            {listing.title}
                          </Link>
                          <span className="text-[10px] text-muted-foreground block truncate font-medium">
                            {listing.categoryName}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-muted-foreground truncate max-w-28 text-[11px] font-medium">
                      {listing.sellerEmail ?? "Unknown seller"}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-foreground">
                      {formatPrice(listing.price, listing.currency)}
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] font-bold px-2 py-0.5 h-5 uppercase rounded-md",
                          isActive
                            ? "bg-primary/10 text-primary border-primary/20"
                            : isPending
                            ? "bg-accent/10 text-accent border-accent/20"
                            : "bg-muted text-muted-foreground border-border"
                        )}
                      >
                          {statusLabel}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3 text-muted-foreground text-[11px]">
                      {formatDate(listing.createdAt)}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="size-7 text-muted-foreground hover:text-foreground rounded-lg"
                              aria-label="Listing actions"
                            >
                              <DotsThreeVertical size={15} weight="bold" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end" className="rounded-xl shadow-md">
                          <DropdownMenuItem className="text-xs">Review Details</DropdownMenuItem>
                          <DropdownMenuItem className="text-xs">Feature Listing</DropdownMenuItem>
                          <DropdownMenuItem className="text-xs text-destructive">Suspend / Reject</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

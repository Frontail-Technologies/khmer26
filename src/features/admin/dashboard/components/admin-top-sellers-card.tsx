"use client"

import Link from "next/link"
import { ArrowRight, SealCheck } from "@phosphor-icons/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminDashboard } from "../hooks/dashboard.queries"

const formatSellerType = (value: string) =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

export function AdminTopSellersCard() {
  const { data } = useAdminDashboard()
  const sellers = data?.topSellers ?? []

  return (
    <Card className="rounded-xl border-0 bg-card p-0 shadow-2xs overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3 flex flex-row items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm sm:text-base font-bold text-foreground">
            Top Verified Merchants
          </CardTitle>
          <Badge variant="outline" className="h-4.5 px-2 text-[9px] font-bold rounded-md text-primary border-primary/30">
            Active Listings
          </Badge>
        </div>

        <Link
          href="/admin/users"
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>All Sellers</span>
          <ArrowRight size={12} weight="bold" />
        </Link>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-border/60 flex-1">
        {sellers.map((seller) => (
          <div
            key={seller.profileId}
            className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="size-9 rounded-full border border-border shrink-0">
                <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                  {seller.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Link href={`/admin/users/${seller.sellerId}`} className="text-xs font-bold text-foreground hover:text-primary truncate">
                    {seller.name}
                  </Link>
                  <SealCheck size={14} weight="fill" className="text-primary shrink-0" />
                </div>

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="truncate">{formatSellerType(seller.sellerType)}</span>
                  <span>|</span>
                  <span className="font-semibold text-foreground">{seller.activeListings.toLocaleString()} active ads</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

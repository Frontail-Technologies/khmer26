import { Storefront, Users, Clock, Star } from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent } from "@/components/ui/card"
import type { SellerProfileDetail } from "../types"

interface SellerStatsProps {
  seller: SellerProfileDetail
}

export function SellerStats({ seller }: SellerStatsProps) {
  const stats = [
    {
      label: "Active Listings",
      value: seller.activeListings.toString(),
      icon: <Storefront size={18} className="text-primary shrink-0" />,
    },
    {
      label: "Followers",
      value: seller.followers.toString(),
      icon: <Users size={18} className="text-primary shrink-0" />,
    },
    {
      label: "Response Time",
      value: seller.responseTime || "Within 1 hour",
      icon: <Clock size={18} className="text-primary shrink-0" />,
    },
    {
      label: "Rating",
      value: `${seller.rating.toFixed(1)} ★ (${seller.reviewCount})`,
      icon: <Star size={18} weight="fill" className="text-accent shrink-0" />,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className="rounded-xl border border-border/70 bg-card p-3 sm:p-3.5 shadow-2xs transition-colors hover:border-primary/30"
        >
          <CardContent className="p-0 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              {stat.icon}
            </div>
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-black text-foreground block truncate">
                {stat.value}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium block truncate">
                {stat.label}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

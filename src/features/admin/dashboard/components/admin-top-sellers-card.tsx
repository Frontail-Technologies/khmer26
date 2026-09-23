import Link from "next/link"
import { SealCheck, Star, ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DEMO_TOP_SELLERS } from "../../data/demo-admin-dashboard"

export function AdminTopSellersCard() {
  return (
    <Card className="rounded-xl border-0 bg-card p-0 shadow-2xs overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3 flex flex-row items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm sm:text-base font-bold text-foreground">
            Top Verified Merchants
          </CardTitle>
          <Badge variant="outline" className="h-4.5 px-2 text-[9px] font-bold rounded-md text-primary border-primary/30">
            High Volume
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
        {DEMO_TOP_SELLERS.map((seller) => (
          <div
            key={seller.id}
            className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="size-9 rounded-full border border-border shrink-0">
                <AvatarImage src={seller.avatar} alt={seller.name} />
                <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                  {seller.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-foreground truncate">
                    {seller.name}
                  </span>
                  {seller.verified && (
                    <SealCheck size={14} weight="fill" className="text-primary shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="truncate">{seller.category}</span>
                  <span>•</span>
                  <span className="font-semibold text-foreground">{seller.activeAds} active ads</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 justify-end text-xs font-bold text-amber-600 dark:text-amber-400">
                <Star size={12} weight="fill" />
                <span>{seller.rating.toFixed(1)}</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground block">
                {seller.totalVolume}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

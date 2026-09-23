import { MapPin, Tag, Calendar, Eye, Heart, CaretRight } from "@phosphor-icons/react/dist/ssr"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AdminListing } from "../types"

interface ListingInformationProps {
  listing: AdminListing
}

export function ListingInformation({ listing }: ListingInformationProps) {
  const formattedPrice =
    listing.currency === "USD"
      ? `$${listing.price.toLocaleString("en-US")}`
      : `${listing.price.toLocaleString("en-US")} KHR`

  return (
    <Card className="rounded-xl border-0 bg-card p-0 shadow-2xs overflow-hidden space-y-0">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/60">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground flex-wrap mb-1">
          {listing.categoryPath.map((segment, idx) => (
            <span key={segment} className="inline-flex items-center gap-1">
              {idx > 0 && <CaretRight size={10} className="text-muted-foreground/60" />}
              <span className={idx === listing.categoryPath.length - 1 ? "text-foreground font-semibold" : ""}>
                {segment}
              </span>
            </span>
          ))}
        </div>
        <CardTitle className="text-base sm:text-lg font-bold text-foreground">
          {listing.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/60">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Asking Price
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
                {formattedPrice}
              </span>
              {listing.negotiable && (
                <Badge variant="outline" className="text-[10px] font-semibold">
                  Negotiable
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye size={15} />
              <span>{listing.viewCount.toLocaleString("en-US")} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart size={15} />
              <span>{listing.favoriteCount.toLocaleString("en-US")} saves</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1 p-2.5 rounded-lg bg-muted/20">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <MapPin size={12} />
              <span>Location</span>
            </span>
            <p className="font-semibold text-foreground">
              {listing.location.district ? `${listing.location.district}, ` : ""}
              {listing.location.province}
            </p>
            {listing.location.address && (
              <p className="text-[11px] text-muted-foreground truncate">
                {listing.location.address}
              </p>
            )}
          </div>

          <div className="space-y-1 p-2.5 rounded-lg bg-muted/20">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Tag size={12} />
              <span>Item Condition</span>
            </span>
            <p className="font-semibold text-foreground">{listing.condition}</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Calendar size={11} />
              <span>Created {listing.createdDate}</span>
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-border/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Listing Description
          </h4>
          <div className="text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-line p-3.5 rounded-xl bg-muted/15 border border-border/40">
            {listing.description}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

import { MapPin, NavigationArrow } from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ListingLocation as ListingLocationType } from "@/types"

interface ListingLocationProps {
  location: ListingLocationType
}

export function ListingLocation({ location }: ListingLocationProps) {
  const displayLocation = location.label || `${location.district ? `${location.district}, ` : ""}${location.province}, Cambodia`

  return (
    <Card className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
      <CardHeader className="p-0 pb-3 sm:pb-4 flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-primary shrink-0" />
          <CardTitle className="text-base sm:text-lg font-bold text-foreground">
            Location
          </CardTitle>
        </div>
        <span className="text-xs font-semibold text-primary">
          {location.province}
        </span>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        <div className="relative aspect-21/9 sm:aspect-3/1 w-full overflow-hidden rounded-lg border border-border/70 bg-muted/50 flex flex-col items-center justify-center p-4 text-center">
          <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[16px_16px]" />
          
          <div className="relative z-10 flex flex-col items-center space-y-1.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md animate-bounce">
              <MapPin size={22} weight="fill" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-foreground">
              {displayLocation}
            </span>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <NavigationArrow size={12} weight="fill" />
              Approximate area
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Exact seller address and landmark details are shared directly upon contacting the seller.
        </p>
      </CardContent>
    </Card>
  )
}

import { ListDashes } from "@phosphor-icons/react/dist/ssr"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { AdminListingSpecification } from "../types"

interface ListingSpecificationsProps {
  specifications: AdminListingSpecification[]
}

export function ListingSpecifications({ specifications }: ListingSpecificationsProps) {
  if (specifications.length === 0) {
    return null
  }

  return (
    <Card className="rounded-xl border border-border/70 bg-card p-0 shadow-none overflow-hidden space-y-0">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/60">
        <CardTitle className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
          <ListDashes size={18} className="text-primary" />
          <span>Listing Specifications</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          {specifications.map((spec, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-muted/20 border border-border/50 space-y-0.5"
            >
              <span className="text-[10px] font-medium text-muted-foreground block truncate">
                {spec.label}
              </span>
              <span className="font-semibold text-foreground block truncate">
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

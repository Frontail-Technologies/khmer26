import { Sliders } from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ListingSpecificationsProps {
  attributes: Array<{
    label: string
    value: string
  }>
}

export function ListingSpecifications({ attributes }: ListingSpecificationsProps) {
  if (!attributes || attributes.length === 0) {
    return null
  }

  return (
    <Card className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
      <CardHeader className="p-0 pb-3 sm:pb-4 flex flex-row items-center gap-2">
        <Sliders size={18} className="text-primary shrink-0" />
        <CardTitle className="text-base sm:text-lg font-bold text-foreground">
          Key Specifications
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {attributes.map((attr, index) => (
            <div
              key={`${attr.label}-${index}`}
              className="flex flex-col justify-center rounded-lg border border-border/60 bg-muted/40 p-2.5 sm:p-3 transition-colors hover:bg-muted/70"
            >
              <span className="text-[11px] sm:text-xs text-muted-foreground font-medium truncate">
                {attr.label}
              </span>
              <span className="text-xs sm:text-sm font-bold text-foreground mt-0.5 wrap-break-word">
                {attr.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

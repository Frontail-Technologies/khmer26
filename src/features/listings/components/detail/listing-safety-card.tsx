import { useTranslations } from "next-intl"
import { LocalizedText } from "@/components/i18n/localized-text"
import { ShieldWarning } from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ListingSafetyCardProps {
  tips: string[]
  isLoading?: boolean
}

export function ListingSafetyCard({ tips, isLoading = false }: ListingSafetyCardProps) {
  const tGenerated = useTranslations("generated")
  if (!isLoading && tips.length === 0) return null

  return (
    <Card size="sm" className="rounded-md shadow-none">
      <CardContent className="space-y-2 pt-(--card-spacing)">
        <div className="flex items-center justify-center gap-2">
          <ShieldWarning size={22} weight="fill" className="text-destructive" />
          <h3 className="text-sm font-bold text-destructive"><LocalizedText id="safetyTipsForBuyers" /></h3>
        </div>

        {isLoading ? (
          <div className="space-y-2" aria-label={tGenerated("loadingSafetyTips")}>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        ) : (
          <ol className="list-decimal space-y-1.5 pl-6 text-xs text-foreground marker:text-foreground">
            {tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}

import { LocalizedText } from "@/components/i18n/localized-text"
import { SquaresFour } from "@phosphor-icons/react/dist/ssr"

export function CategoryEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card py-12 sm:py-16 px-6 text-center shadow-2xs">
      <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-muted/60 mb-4 text-muted-foreground/80">
        <SquaresFour size={36} weight="duotone" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
        <LocalizedText id="noListingsFoundInThisCategory" />
      </h3>
    </div>
  )
}

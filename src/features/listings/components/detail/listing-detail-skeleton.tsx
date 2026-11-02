import { Container } from "@/components/layout/Container"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Mirrors ListingDetailContent's layout (breadcrumb, full-bleed gallery card with thumbnail strip and
 * title/price panel, seller card, description card) so content swaps in without the page jumping.
 * Used by both the route's loading.tsx and the client while the listing query is pending.
 */
export function ListingDetailSkeleton({ label }: { label?: string }) {
  return (
    <div className="min-h-dvh bg-background pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-12">
      <Container className="py-0 sm:py-4">
        <div aria-busy="true" aria-label={label}>
          <div className="hidden py-2 sm:block">
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>

          <div className="mt-0 grid grid-cols-1 items-start gap-2.5 sm:mt-2 sm:gap-3 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-4">
            <div className="-mx-3 min-w-0 overflow-hidden rounded-none border-y border-border/70 bg-card sm:-mx-4 md:mx-0 md:rounded-md md:border lg:col-start-1 lg:row-start-1">
              <Skeleton className="aspect-4/3 w-full rounded-none sm:aspect-16/10" />
              <div className="flex gap-0.5 border-t border-border/60 py-0.5 sm:gap-1.5 sm:px-3 sm:py-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-[4.25rem] w-[31%] shrink-0 rounded-none sm:h-14 sm:w-[4.5rem] sm:rounded-sm" />
                ))}
              </div>
              <div className="space-y-2 border-t border-border/60 px-3 py-2.5 sm:px-4 sm:py-3">
                <Skeleton className="h-6 w-4/5" />
                <Skeleton className="h-3.5 w-3/5" />
                <Skeleton className="h-7 w-32" />
              </div>
            </div>

            <div className="space-y-3 lg:col-start-2 lg:row-span-3 lg:row-start-1">
              <div className="overflow-hidden rounded-md border border-border/70 bg-card">
                <div className="flex items-center gap-2.5 px-3 py-2.5 md:gap-3 md:px-3.5 md:py-3">
                  <Skeleton className="size-10 shrink-0 rounded-full md:size-12" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <div className="border-t border-border/60 px-3 py-3">
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
              <Skeleton className="hidden h-40 w-full rounded-md lg:block" />
            </div>

            <div className="min-w-0 space-y-3 rounded-md border border-border/70 bg-card p-3 md:space-y-4 md:p-4 lg:col-start-1 lg:row-start-2">
              <Skeleton className="h-4 w-28" />
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

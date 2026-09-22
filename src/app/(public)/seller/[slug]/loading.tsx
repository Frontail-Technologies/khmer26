import { Container } from "@/components/layout/Container"
import { Skeleton } from "@/components/ui/skeleton"

export default function SellerProfileLoading() {
  return (
    <div className="min-h-screen bg-background pb-12">
      <Container className="py-3 sm:py-4">
        <Skeleton className="h-5 w-48 mb-3 rounded-md" />

        <div className="space-y-6">
          <div className="rounded-2xl border border-border/80 bg-card overflow-hidden">
            <Skeleton className="h-40 sm:h-56 w-full rounded-none" />
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
                  <div className="-mt-10 sm:-mt-14 shrink-0">
                    <Skeleton className="h-20 w-20 sm:h-28 sm:w-28 rounded-2xl border-4 border-card" />
                  </div>
                  <div className="pt-1 sm:pt-2 pb-1 space-y-2">
                    <Skeleton className="h-7 w-48 sm:w-64 rounded-md" />
                    <Skeleton className="h-4 w-32 rounded-md" />
                  </div>
                </div>
                <div className="flex gap-2 pt-2 sm:pt-0">
                  <Skeleton className="h-10 w-32 rounded-lg" />
                  <Skeleton className="h-10 w-24 rounded-lg" />
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-border/60 flex gap-4">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-4 w-36 rounded-md" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>

          <div className="space-y-4 pt-2">
            <Skeleton className="h-11 w-72 rounded-lg" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <Skeleton className="aspect-4/3 w-full rounded-xl" />
              <Skeleton className="aspect-4/3 w-full rounded-xl" />
              <Skeleton className="aspect-4/3 w-full rounded-xl" />
              <Skeleton className="aspect-4/3 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

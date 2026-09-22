import { Container } from "@/components/layout/Container"
import { Skeleton } from "@/components/ui/skeleton"

export default function ListingDetailLoading() {
  return (
    <Container className="py-4 sm:py-6">
      <div className="mb-4">
        <Skeleton className="h-5 w-64 rounded-md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Skeleton className="aspect-16/10 w-full rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="h-20 w-24 rounded-lg" />
            <Skeleton className="h-20 w-24 rounded-lg" />
            <Skeleton className="h-20 w-24 rounded-lg" />
            <Skeleton className="h-20 w-24 rounded-lg" />
          </div>
          <Skeleton className="h-44 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>

        <div className="lg:col-span-4 space-y-4">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    </Container>
  )
}

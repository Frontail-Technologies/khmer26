import { Suspense } from "react"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { Container } from "@/components/layout/Container"
import { HomeContent, HomeSkeleton } from "@/features/home/components/home-content"
import { homeQueryOptions } from "@/features/home/api/home.queries"
import type { HomeResponse } from "@/features/home/api/home.api"
import { isClientNavigation, serverApiGet } from "@/lib/api/server-fetch"

/**
 * Fetches the home feed on the server so listings are in the first HTML instead of appearing after
 * the JavaScript loads and calls the API. The header streams immediately; only this part waits.
 * If the API is slow or down, the query is skipped and the browser fetches as before.
 */
async function PrefetchedHome() {
  // Returning to Home in-app: the browser cache already holds the feed, so don't wait on the server.
  if (await isClientNavigation()) return <HomeContent />
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    ...homeQueryOptions(),
    queryFn: () => serverApiGet<HomeResponse>("/home", { revalidate: 30 }),
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeContent />
    </HydrationBoundary>
  )
}

export default function HomePage() {
  return (
    <Container>
      <div className="pb-16 md:pb-6">
        <Suspense fallback={<HomeSkeleton />}>
          <PrefetchedHome />
        </Suspense>
      </div>
    </Container>
  )
}

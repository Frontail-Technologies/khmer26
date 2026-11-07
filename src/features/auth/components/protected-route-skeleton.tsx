"use client"

import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { LoadingState } from "@/components/shared/LoadingState"
import { ConversationListSkeleton } from "@/features/messages/components/messages-skeleton"
import { WizardSkeleton } from "@/features/post-ad/components/post-ad-wizard"

/**
 * Placeholder for a signed-in route while the session is confirmed or the route streams in.
 * Full-screen flows get a skeleton of their own layout so nothing jumps when they render.
 */
export function ProtectedRouteSkeleton() {
  const pathname = usePathname()
  const tGenerated = useTranslations("generated")

  if (pathname === "/messages" || pathname.startsWith("/messages/")) {
    return (
      <div className="flex h-dvh overflow-hidden bg-background max-md:h-[calc(100dvh-var(--mobile-nav-height,4rem)-env(safe-area-inset-bottom,0px))]">
        <ConversationListSkeleton className="w-full shrink-0 md:w-80 lg:w-96" />
        <div className="hidden flex-1 border-l border-border/70 bg-card/40 md:block" />
      </div>
    )
  }

  if (pathname === "/post-ad") {
    return (
      <div className="min-h-screen bg-background max-md:bg-card">
        <Container className="max-md:px-0 md:py-8">
          <WizardSkeleton title={tGenerated("postAnAd")} />
        </Container>
      </div>
    )
  }

  return (
    <Container className="py-6">
      <div aria-busy="true" aria-label={tGenerated("loading_8f26c6")}>
        <LoadingState variant="list" count={5} />
      </div>
    </Container>
  )
}

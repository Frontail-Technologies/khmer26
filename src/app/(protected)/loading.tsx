import { ProtectedRouteSkeleton } from "@/features/auth/components/protected-route-skeleton"

/** Shown while a signed-in route (account, messages, post ad) streams in. */
export default function ProtectedLoading() {
  return <ProtectedRouteSkeleton />
}

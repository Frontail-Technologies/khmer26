import { Suspense } from "react"
import { ConnectivityBanner } from "./connectivity-banner"
import { InstallPrompt } from "./install-prompt"
import { NavigationProgress } from "./navigation-progress"
import { ServiceWorkerRegistrar } from "./service-worker-registrar"
import { PushSync } from "@/features/push/push-sync"

/** App-like chrome for the public marketplace: progress bar, offline status, install card, service worker. */
export function PwaShell() {
  return (
    <>
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <ConnectivityBanner />
      <InstallPrompt />
      <ServiceWorkerRegistrar />
      <PushSync />
    </>
  )
}

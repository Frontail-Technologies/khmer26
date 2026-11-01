import type { Metadata } from "next"
import { Suspense } from "react"
import { QueueWorkspace } from "@/features/admin/queue/queue-workspace"

export const metadata: Metadata = { title: "Queue" }

export default function AdminQueuePage() {
  return (
    <Suspense fallback={null}>
      <QueueWorkspace />
    </Suspense>
  )
}

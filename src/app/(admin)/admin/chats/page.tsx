import type { Metadata } from "next"
import { AdminChatsWorkspace } from "@/features/admin/chats/components/admin-chats-workspace"

export const metadata: Metadata = {
  title: "Chats",
  description: "Inspect user conversations and marketplace chat history.",
}

interface AdminChatsPageProps {
  searchParams: Promise<{
    user?: string
    conversation?: string
  }>
}

export default async function AdminChatsPage({
  searchParams,
}: AdminChatsPageProps) {
  const resolvedParams = await searchParams

  return (
    <AdminChatsWorkspace
      initialUserId={resolvedParams?.user}
      initialConversationId={resolvedParams?.conversation}
    />
  )
}

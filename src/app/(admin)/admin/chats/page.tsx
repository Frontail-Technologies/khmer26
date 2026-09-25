import type { Metadata } from "next"
import { AdminChatsWorkspace } from "@/features/admin/chats/components/admin-chats-workspace"
import {
  DEMO_CHAT_USERS,
  DEMO_CHAT_CONVERSATIONS,
} from "@/features/admin/chats/data/demo-chats-data"

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
      users={DEMO_CHAT_USERS}
      conversations={DEMO_CHAT_CONVERSATIONS}
      initialUserId={resolvedParams?.user}
      initialConversationId={resolvedParams?.conversation}
    />
  )
}

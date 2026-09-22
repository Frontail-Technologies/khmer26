import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { MessagesShell } from "@/features/messages/components/messages-shell"
import { DEMO_CONVERSATIONS } from "@/features/messages/data/demo-conversations"

interface ConversationPageProps {
  params: Promise<{ conversationId: string }>
}

export async function generateMetadata({ params }: ConversationPageProps): Promise<Metadata> {
  const { conversationId } = await params
  const conversation = DEMO_CONVERSATIONS.find((c) => c.id === conversationId)

  if (!conversation) {
    return { title: "Conversation Not Found" }
  }

  return {
    title: `Chat with ${conversation.participant.name} — ${conversation.listing.title}`,
    description: `Marketplace chat for ${conversation.listing.title} on Khmer26`,
  }
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const { conversationId } = await params
  const conversation = DEMO_CONVERSATIONS.find((c) => c.id === conversationId)

  if (!conversation) {
    notFound()
  }

  return (
    <MessagesShell
      initialConversations={DEMO_CONVERSATIONS}
      activeConversationId={conversationId}
    />
  )
}

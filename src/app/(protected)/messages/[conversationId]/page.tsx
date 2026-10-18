import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { MessagesShell } from "@/features/messages/components/messages-shell"

interface ConversationPageProps {
  params: Promise<{ conversationId: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.conversation")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const { conversationId } = await params
  return <MessagesShell activeConversationId={conversationId} />
}

import { MessagesShell } from "@/features/messages/components/messages-shell"
import { DEMO_CONVERSATIONS } from "@/features/messages/data/demo-conversations"

export const metadata = {
  title: "Messages",
  description: "Marketplace buyer and seller messages on Khmer26",
}

export default function MessagesPage() {
  return <MessagesShell initialConversations={DEMO_CONVERSATIONS} />
}

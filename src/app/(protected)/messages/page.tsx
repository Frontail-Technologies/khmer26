import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { MessagesShell } from "@/features/messages/components/messages-shell"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.messages")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function MessagesPage() {
  return <MessagesShell />
}

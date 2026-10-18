"use client"

import { useTranslations } from "next-intl"
import type en from "../../../messages/en.json"

type GeneratedMessageId = keyof typeof en.generated

interface LocalizedTextProps {
  id: GeneratedMessageId
}

/** Renders extracted static interface copy from the current locale catalog. */
export function LocalizedText({ id }: LocalizedTextProps) {
  const t = useTranslations("generated")
  return <>{t(id)}</>
}

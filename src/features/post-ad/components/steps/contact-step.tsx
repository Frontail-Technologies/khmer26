"use client"

import { useTranslations } from "next-intl"
import { LocalizedText } from "@/components/i18n/localized-text"

import { ChatCircleDots, Phone, DeviceMobile, ShieldCheck } from "@phosphor-icons/react"
import type { ListingDraft } from "../../types"

interface ContactStepProps {
  draft: ListingDraft
  onChange: (updates: Partial<ListingDraft>) => void
  errors?: Record<string, string>
}

export function ContactStep({ draft, onChange }: ContactStepProps) {
  const t = useTranslations("ui.postAd")
  const methods = [
    {
      id: "chat",
      title: t("contactChatTitle"),
      badge: t("contactChatBadge"),
      description: t("contactChatDescription"),
      icon: <ChatCircleDots size={22} weight="fill" className="text-primary" />,
    },
    {
      id: "both",
      title: t("contactBothTitle"),
      description: t("contactBothDescription"),
      icon: <DeviceMobile size={22} weight="fill" className="text-primary" />,
    },
    {
      id: "phone",
      title: t("contactPhoneTitle"),
      description: t("contactPhoneDescription"),
      icon: <Phone size={22} weight="bold" className="text-primary" />,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-foreground">
          <LocalizedText id="contactPreferences" />
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {methods.map((m) => {
          const isSelected = draft.contactMethod === m.id

          return (
            <div
              key={m.id}
              onClick={() => onChange({ contactMethod: m.id as "chat" | "phone" | "both" })}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/10 ring-1 ring-primary/40 shadow-xs"
                  : "border-border/80 bg-card hover:bg-muted/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0 mt-0.5">
                  {m.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-foreground">
                      {m.title}
                    </span>
                    {m.badge && (
                      <span className="text-2xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xxs sm:text-xs text-muted-foreground mt-0.5">
                    {m.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground">
        <ShieldCheck size={18} weight="fill" className="text-primary shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <LocalizedText id="phoneOptionsUseTheNumberSavedOnYourSeller" />
        </p>
      </div>
    </div>
  )
}

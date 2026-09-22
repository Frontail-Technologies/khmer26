"use client"

import { ChatCircleDots, Phone, DeviceMobile, ShieldCheck } from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import type { ListingDraft } from "../../types"

interface ContactStepProps {
  draft: ListingDraft
  onChange: (updates: Partial<ListingDraft>) => void
  errors?: Record<string, string>
}

export function ContactStep({ draft, onChange, errors = {} }: ContactStepProps) {
  const methods = [
    {
      id: "chat",
      title: "In-App Chat Only",
      badge: "Recommended",
      description: "Fast, safe, and spam-free communication within Khmer26 messaging.",
      icon: <ChatCircleDots size={22} weight="fill" className="text-primary" />,
    },
    {
      id: "both",
      title: "Chat & Phone Call",
      description: "Receive instant chat messages plus direct phone calls from buyers.",
      icon: <DeviceMobile size={22} weight="fill" className="text-primary" />,
    },
    {
      id: "phone",
      title: "Phone Call Only",
      description: "Buyers will contact you directly via your verified phone number.",
      icon: <Phone size={22} weight="bold" className="text-primary" />,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-foreground">
          Contact Preferences
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Choose how you prefer potential buyers to get in touch with you
        </p>
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
                      <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                    {m.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {(draft.contactMethod === "phone" || draft.contactMethod === "both") && (
        <div className="space-y-3 pt-2 border-t border-border/60">
          <div className="space-y-1.5">
            <label htmlFor="contact-phone" className="text-xs font-bold text-foreground">
              Contact Phone Number <span className="text-destructive">*</span>
            </label>
            <Input
              id="contact-phone"
              type="tel"
              placeholder="+855 12 345 678"
              value={draft.phoneNumber}
              onChange={(e) => onChange({ phoneNumber: e.target.value })}
              className="h-10 text-xs sm:text-sm"
            />
            {errors.phoneNumber && (
              <p className="text-[11px] font-medium text-destructive mt-1">
                {errors.phoneNumber}
              </p>
            )}
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <Checkbox
              checked={draft.hidePhoneUntilClick}
              onCheckedChange={(checked) => onChange({ hidePhoneUntilClick: Boolean(checked) })}
            />
            <span className="text-xs text-muted-foreground">
              Hide phone number until buyer clicks &quot;Show Phone&quot;
            </span>
          </label>
        </div>
      )}

      <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground">
        <ShieldCheck size={18} weight="fill" className="text-primary shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Your personal contact details are protected under Khmer26 privacy terms and only shared with verified buyers per your preferences.
        </p>
      </div>
    </div>
  )
}

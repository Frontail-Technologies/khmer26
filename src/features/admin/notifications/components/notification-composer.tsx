"use client"

import { useState } from "react"
import { PaperPlaneTilt, Info } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
  type SelectOption,
} from "@/components/ui/select"

const AUDIENCE_OPTIONS: SelectOption[] = [
  { value: "all_users", label: "All Users" },
  { value: "buyers", label: "Buyers" },
  { value: "sellers", label: "Sellers" },
  { value: "dealers", label: "Businesses & Dealers" },
  { value: "specific_user", label: "Specific User" },
]

export function NotificationComposer() {
  const [audience, setAudience] = useState("all_users")
  const [targetUser, setTargetUser] = useState("")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")

  return (
    <div className="p-4 sm:p-6 max-w-2xl">
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-xs">
        <Field className="gap-2">
          <FieldLabel className="text-xs font-semibold text-foreground">Audience</FieldLabel>
          <Select
            value={audience}
            items={AUDIENCE_OPTIONS}
            onValueChange={(val) => setAudience(val ?? "all_users")}
          >
            <SelectTrigger className="h-9 text-xs w-full">
              <SelectValue placeholder="Select audience">
                {(val) => getSelectOptionLabel(AUDIENCE_OPTIONS, val, "Select audience")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {AUDIENCE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {audience === "specific_user" && (
          <Field className="gap-2">
            <FieldLabel className="text-xs font-semibold text-foreground">Specific User ID or Username</FieldLabel>
            <Input
              placeholder="e.g. USR-1001 or sokhaseng"
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              className="h-9 text-xs"
            />
          </Field>
        )}

        <Field className="gap-2">
          <FieldLabel className="text-xs font-semibold text-foreground">Title</FieldLabel>
          <Input
            placeholder="Enter notification title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-9 text-xs font-medium"
          />
        </Field>

        <Field className="gap-2">
          <FieldLabel className="text-xs font-semibold text-foreground">Message</FieldLabel>
          <Textarea
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="text-xs min-h-[110px] resize-none leading-relaxed"
          />
        </Field>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Info size={14} className="shrink-0 text-muted-foreground" />
            <span>Notification service integration pending backend configuration.</span>
          </div>

          <Button
            type="button"
            disabled
            className="h-9 text-xs font-semibold shrink-0 opacity-60 cursor-not-allowed"
          >
            <PaperPlaneTilt size={14} className="mr-1.5" />
            Send Notification
          </Button>
        </div>
      </form>
    </div>
  )
}

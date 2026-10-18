"use client"

import { useState } from "react"
import { PaperPlaneTilt, Info } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
  type SelectOption,
} from "@/components/ui/select"
import { useCreateBroadcast } from "../hooks/notifications.mutations"
import type { NotificationAudience } from "../types"
import { BilingualField } from "@/components/admin/bilingual-field"

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
  const [titleKm, setTitleKm] = useState("")
  const [message, setMessage] = useState("")
  const [messageKm, setMessageKm] = useState("")
  const createBroadcast = useCreateBroadcast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !message.trim()) return
    if (audience === "specific_user" && !targetUser.trim()) return

    createBroadcast.mutate(
      {
        title: title.trim(),
        titleKm: titleKm.trim() || null,
        body: message.trim(),
        bodyKm: messageKm.trim() || null,
        audience: audience as NotificationAudience,
        specificUserId: audience === "specific_user" ? targetUser.trim() : undefined,
      },
      {
        onSuccess: () => {
          setTitle("")
          setTitleKm("")
          setMessage("")
          setMessageKm("")
          setTargetUser("")
        },
      }
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
            <FieldLabel className="text-xs font-semibold text-foreground">Specific User ID</FieldLabel>
            <Input
              placeholder="User account ID (UUID)"
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              className="h-9 text-xs"
            />
          </Field>
        )}

        <BilingualField
          id="broadcast-title"
          label="Title"
          required
          valueEn={title}
          valueKm={titleKm}
          onChangeEn={setTitle}
          onChangeKm={setTitleKm}
          placeholderEn="Enter notification title"
          maxLength={200}
        />

        <BilingualField
          id="broadcast-message"
          label="Message"
          required
          multiline
          rows={4}
          valueEn={message}
          valueKm={messageKm}
          onChangeEn={setMessage}
          onChangeKm={setMessageKm}
          placeholderEn="Write your message..."
          maxLength={2000}
        />

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xxs text-muted-foreground">
            <Info size={14} className="shrink-0 text-muted-foreground" />
            <span>Delivery is processed in bounded background batches, not instantly.</span>
          </div>

          <Button
            type="submit"
            disabled={createBroadcast.isPending}
            className="h-9 text-xs font-semibold shrink-0"
          >
            <PaperPlaneTilt size={14} className="mr-1.5" />
            {createBroadcast.isPending ? "Sending..." : "Send Notification"}
          </Button>
        </div>
      </form>
    </div>
  )
}

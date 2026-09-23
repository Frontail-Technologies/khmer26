"use client"

import { useState } from "react"
import { PaperPlaneTilt, Info } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  { value: "all_users", label: "All Registered Users (124k+)" },
  { value: "sellers", label: "Active Sellers (8.9k)" },
  { value: "dealers", label: "Verified Dealerships (1.4k)" },
  { value: "buyers", label: "Buyer Accounts" },
]

const CHANNEL_OPTIONS: SelectOption[] = [
  { value: "push", label: "Mobile Push (FCM / APNs)" },
  { value: "in_app", label: "In-App Notification Feed" },
  { value: "sms", label: "SMS Broadcast (Cellcard/Smart)" },
  { value: "telegram", label: "Telegram Bot Broadcast" },
]

export function NotificationComposer() {
  const [audience, setAudience] = useState("all_users")
  const [channel, setChannel] = useState("push")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [targetUrl, setTargetUrl] = useState("")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7">
        <Card className="bg-card border-0 rounded-xl shadow-2xs">
          <CardHeader className="py-3 px-4 border-b border-border/60">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <PaperPlaneTilt size={14} />
              Broadcast Notification Composer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field className="gap-2">
                <FieldLabel>Target Audience</FieldLabel>
                <Select
                  value={audience}
                  items={AUDIENCE_OPTIONS}
                  onValueChange={(val) => setAudience(val ?? "all_users")}
                >
                  <SelectTrigger className="h-8 text-xs w-full">
                    <SelectValue placeholder="Audience">
                      {(val) => getSelectOptionLabel(AUDIENCE_OPTIONS, val, "Audience")}
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

              <Field className="gap-2">
                <FieldLabel>Delivery Channel</FieldLabel>
                <Select
                  value={channel}
                  items={CHANNEL_OPTIONS}
                  onValueChange={(val) => setChannel(val ?? "push")}
                >
                  <SelectTrigger className="h-8 text-xs w-full">
                    <SelectValue placeholder="Channel">
                      {(val) => getSelectOptionLabel(CHANNEL_OPTIONS, val, "Channel")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {CHANNEL_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field className="gap-2">
              <FieldLabel>Notification Headline / Title</FieldLabel>
              <Input
                placeholder="e.g. Special Weekend Bump Promo..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-8 text-xs font-semibold"
              />
            </Field>

            <Field className="gap-2">
              <FieldLabel>Message Body</FieldLabel>
              <Textarea
                placeholder="Write your announcement or alert content..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="text-xs min-h-[100px] resize-none leading-relaxed"
              />
            </Field>

            <Field className="gap-2">
              <FieldLabel>In-App Target Route (Optional)</FieldLabel>
              <Input
                placeholder="e.g. /promotions or /category/vehicles"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="h-8 text-xs font-mono"
              />
            </Field>

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Info size={14} />
                <span>Backend dispatch integration required to trigger push gateways.</span>
              </div>

              <Button size="sm" className="h-8 text-xs">
                <PaperPlaneTilt size={13} className="mr-1.5" />
                Dispatch Broadcast
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-5 space-y-3">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
          Receiver Device Mockup
        </div>

        <Card className="p-4 bg-muted/20 border-0 rounded-xl shadow-2xs">
          <div className="max-w-[300px] mx-auto rounded-2xl bg-background border border-border p-3 space-y-3 shadow-md">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground pb-2 border-b border-border/40">
              <span className="font-semibold text-foreground">Khmer26 Marketplace</span>
              <span>now</span>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-xs text-foreground block">
                {title.trim() || "Notification Title Appears Here"}
              </span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {message.trim() || "Your message body content will display on buyer and seller lock screens and in-app banners."}
              </p>
            </div>

            {targetUrl && (
              <div className="pt-1 text-[10px] font-mono text-primary truncate">
                Target: {targetUrl}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

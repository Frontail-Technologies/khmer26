"use client"

import { useState } from "react"
import { FloppyDisk, ChatText, DeviceMobile, PaperPlaneTilt, Envelope } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import type { PlatformSettings } from "../types"

interface CommunicationSettingsFormProps {
  initialData: PlatformSettings["communication"]
}

export function CommunicationSettingsForm({ initialData }: CommunicationSettingsFormProps) {
  const [formData, setFormData] = useState(initialData)

  return (
    <Card className="bg-card border-0 rounded-xl shadow-2xs">
      <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <ChatText size={14} />
          Communication Gateway Configuration
        </CardTitle>
        <Button size="sm" className="h-8 text-xs">
          <FloppyDisk size={14} className="mr-1.5" />
          Save Settings
        </Button>
      </CardHeader>
      <CardContent className="p-4 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field className="gap-2">
            <FieldLabel className="flex items-center gap-1.5">
              <Envelope size={13} />
              Default Sender Email (SMTP / SES)
            </FieldLabel>
            <Input
              value={formData.senderEmail}
              onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
              className="h-8 text-xs"
            />
          </Field>

          <Field className="gap-2">
            <FieldLabel className="flex items-center gap-1.5">
              <ChatText size={13} />
              Cambodia SMS Gateway Provider
            </FieldLabel>
            <Input
              value={formData.smsGatewayProvider}
              onChange={(e) => setFormData({ ...formData, smsGatewayProvider: e.target.value })}
              className="h-8 text-xs font-mono"
            />
          </Field>
        </div>

        <div className="space-y-3 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border/70">
            <div className="space-y-0.5">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <DeviceMobile size={14} className="text-primary" />
                Firebase Cloud Messaging (FCM Push)
              </span>
              <span className="text-[11px] text-muted-foreground block">
                Deliver instant push notifications to iOS and Android marketplace apps.
              </span>
            </div>
            <Switch
              checked={formData.fcmPushConfigured}
              onCheckedChange={(checked) => setFormData({ ...formData, fcmPushConfigured: checked })}
              aria-label="Toggle FCM push"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border/70">
            <div className="space-y-0.5">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <PaperPlaneTilt size={14} className="text-sky-500" />
                Telegram Staff Security Alerts Bot
              </span>
              <span className="text-[11px] text-muted-foreground block">
                Dispatch critical high-risk incident alerts to internal Trust & Safety channel.
              </span>
            </div>
            <Switch
              checked={formData.telegramBotAlerts}
              onCheckedChange={(checked) => setFormData({ ...formData, telegramBotAlerts: checked })}
              aria-label="Toggle Telegram alerts"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

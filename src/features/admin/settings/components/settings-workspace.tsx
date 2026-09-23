"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Storefront, ShieldWarning, ChatText, LockKey } from "@phosphor-icons/react"
import { GeneralSettingsForm } from "./general-settings-form"
import { MarketplaceSettingsForm } from "./marketplace-settings-form"
import { ModerationSettingsForm } from "./moderation-settings-form"
import { CommunicationSettingsForm } from "./communication-settings-form"
import { SecuritySettingsForm } from "./security-settings-form"
import type { PlatformSettings } from "../types"

interface SettingsWorkspaceProps {
  settings: PlatformSettings
}

export function SettingsWorkspace({ settings }: SettingsWorkspaceProps) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 h-auto bg-card border-0 p-1.5 rounded-xl mb-4 sm:mb-5 gap-1.5 shadow-2xs">
          <TabsTrigger value="general" className="text-xs font-semibold rounded-lg py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-2xs">
            <Globe size={15} className="mr-1.5" weight="bold" />
            General
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="text-xs font-semibold rounded-lg py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-2xs">
            <Storefront size={15} className="mr-1.5" weight="bold" />
            Marketplace
          </TabsTrigger>
          <TabsTrigger value="moderation" className="text-xs font-semibold rounded-lg py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-2xs">
            <ShieldWarning size={15} className="mr-1.5" weight="bold" />
            Moderation
          </TabsTrigger>
          <TabsTrigger value="communication" className="text-xs font-semibold rounded-lg py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-2xs">
            <ChatText size={15} className="mr-1.5" weight="bold" />
            Gateways
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs font-semibold rounded-lg py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-2xs">
            <LockKey size={15} className="mr-1.5" weight="bold" />
            Security & 2FA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettingsForm initialData={settings.general} />
        </TabsContent>

        <TabsContent value="marketplace">
          <MarketplaceSettingsForm initialData={settings.marketplace} />
        </TabsContent>

        <TabsContent value="moderation">
          <ModerationSettingsForm initialData={settings.moderation} />
        </TabsContent>

        <TabsContent value="communication">
          <CommunicationSettingsForm initialData={settings.communication} />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettingsForm initialData={settings.security} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AccountPageHeader } from "@/features/account/components/account-page-header"
import { useAccountProfile } from "../api/profile.queries"
import { ProfileForm } from "./profile-form"
import { VerificationCard } from "./verification-card"

function completion(account: NonNullable<ReturnType<typeof useAccountProfile>["data"]>): number {
  const profile = account.sellerProfile
  const fields = [profile?.fullName, profile?.username, account.user.email, profile?.phone, profile?.provinceId, profile?.bio, profile?.avatarMediaId]
  return Math.round((fields.filter(Boolean).length / fields.length) * 100)
}

export function ProfileView() {
  const tGenerated = useTranslations("generated")
  const tDynamic = useTranslations("dynamic")
  const query = useAccountProfile()

  if (query.isLoading) {
    return <div className="space-y-5"><Skeleton className="h-14 w-full" /><div className="grid gap-6 lg:grid-cols-12"><Skeleton className="h-[620px] lg:col-span-8" /><Skeleton className="h-60 lg:col-span-4" /></div></div>
  }

  if (query.isError || !query.data) {
    return <div className="rounded-lg border bg-card p-8 text-center"><h2 className="font-bold"><LocalizedText id="profileCouldNotBeLoaded" /></h2><p className="mt-1 text-sm text-muted-foreground">{query.error instanceof Error ? query.error.message : tGenerated("pleaseTryAgain")}</p><Button className="mt-4" variant="outline" onClick={() => query.refetch()}><LocalizedText id="tryAgain" /></Button></div>
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <AccountPageHeader title={tGenerated("profile")} action={<Badge variant="outline" className="border-primary/20 bg-primary/10 text-xs font-bold text-primary">{tDynamic("profileComplete", { percent: completion(query.data) })}</Badge>} />
      <div className="grid grid-cols-1 items-start gap-5 sm:gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8"><ProfileForm key={query.data.sellerProfile?.updatedAt ?? "new"} account={query.data} /></div>
        <div className="lg:sticky lg:top-20 lg:col-span-4"><VerificationCard account={query.data} /></div>
      </div>
    </div>
  )
}

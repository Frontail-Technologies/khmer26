"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react"
import { Camera, CheckCircle, EnvelopeSimple, Storefront, Trash, User, WarningCircle } from "@phosphor-icons/react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useDistricts, useProvinces } from "@/features/locations/api/locations.queries"
import { useMediaUpload } from "@/hooks/use-media-upload"
import { getMediaUrl } from "@/lib/media/get-media-url"
import { useSaveAccountProfile } from "../api/profile.queries"
import type { AccountProfile, SellerType } from "../api/profile.api"
import { useLocalizedName } from "@/lib/i18n/localized"

interface ProfileFormProps {
  account: AccountProfile
}

export function ProfileForm({ account }: ProfileFormProps) {
  const tGenerated = useTranslations("generated")
  const t = useTranslations("ui.account")
  const getLocalizedName = useLocalizedName()
  const current = account.sellerProfile
  const emailName = account.user.email?.split("@")[0] ?? "member"
  const [fullName, setFullName] = useState(current?.fullName ?? current?.shopName ?? "")
  const [username, setUsername] = useState(current?.username ?? emailName)
  const [phone, setPhone] = useState(current?.phone ?? "")
  const [bio, setBio] = useState(current?.bio ?? "")
  const [sellerType, setSellerType] = useState<SellerType>(current?.sellerType ?? "individual")
  const [shopName, setShopName] = useState(current?.shopName ?? "")
  const [provinceId, setProvinceId] = useState<number | undefined>(current?.provinceId ?? undefined)
  const [districtId, setDistrictId] = useState<number | undefined>(current?.districtId ?? undefined)
  const [isDirty, setIsDirty] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const avatarUrl = getMediaUrl(current?.avatarR2Key)
  const uploader = useMediaUpload({
    purpose: "seller_avatar",
    max: 1,
    initialItems: current?.avatarMediaId && avatarUrl ? [{
      id: `existing-${current.avatarMediaId}`,
      previewUrl: avatarUrl,
      progress: 100,
      status: "done",
      mediaId: current.avatarMediaId,
      name: t("profilePhotoAlt"),
    }] : [],
  })
  const provinces = useProvinces()
  const districts = useDistricts(provinceId)
  const saveProfile = useSaveAccountProfile(current?.id ?? null)

  const displayName = fullName.trim() || shopName.trim() || emailName
  const displayedAvatar = uploader.items[0]?.previewUrl
  const canSave = isDirty && !uploader.isUploading && !uploader.hasErrors && !saveProfile.isPending
  const selectedProvince = useMemo(
    () => provinces.data?.find((item) => item.id === provinceId),
    [provinceId, provinces.data]
  )

  function handlePhoto(files: FileList | null) {
    if (!files?.length) return
    uploader.clear()
    uploader.addFiles([files[0]])
    setIsDirty(true)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const cleanName = fullName.trim()
    const effectiveShopName = sellerType === "individual" ? cleanName : shopName.trim()
    if (!cleanName || !effectiveShopName) {
      toast.error(tGenerated("enterYourFullNameAndSellerName"))
      return
    }
    try {
      await saveProfile.mutateAsync({
        fullName: cleanName,
        username: username.trim(),
        phone: phone.trim() || null,
        bio: bio.trim() || null,
        shopName: effectiveShopName,
        sellerType,
        avatarMediaId: uploader.mediaIds[0] ?? null,
        provinceId: provinceId ?? null,
        districtId: districtId ?? null,
      })
      setIsDirty(false)
      toast.success(tGenerated("profileSaved"))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("profileSaveFailed"))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs sm:p-6">
        <CardContent className="space-y-6 p-0">
          <div className="flex items-center gap-4 sm:gap-5">
            <Avatar className="h-18 w-18 shrink-0 border-2 border-border/80 sm:h-20 sm:w-20">
              <AvatarImage src={displayedAvatar} alt={displayName} />
              <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                {displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <h2 className="truncate text-base font-bold sm:text-lg">{displayName}</h2>
                <p className="truncate text-xs text-muted-foreground">@{username || emailName}</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => handlePhoto(event.target.files)} />
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="xs" className="h-8 gap-1.5" onClick={() => fileInputRef.current?.click()} disabled={uploader.isUploading}>
                  {uploader.isUploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                  {uploader.isUploading ? `Uploading ${uploader.items[0]?.progress ?? 0}%` : tGenerated("changePhoto")}
                </Button>
                {uploader.items.length > 0 && (
                  <Button type="button" variant="ghost" size="xs" className="h-8 gap-1 text-destructive hover:text-destructive" onClick={() => { uploader.clear(); setIsDirty(true) }}>
                    <Trash size={14} /> <LocalizedText id="remove" />
                  </Button>
                )}
              </div>
              {(uploader.rejections[0] || uploader.items[0]?.error) && (
                <p className="flex items-center gap-1 text-xs text-destructive"><WarningCircle size={14} />{uploader.rejections[0] || uploader.items[0]?.error}</p>
              )}
            </div>
          </div>

          <Separator />
          <section className="space-y-4">
            <h3 className="text-sm font-bold sm:text-base"><LocalizedText id="basicInformation" /></h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={tGenerated("fullName")} icon={<User size={14} />}><Input value={fullName} onChange={(event) => { setFullName(event.target.value); setIsDirty(true) }} maxLength={100} required /></Field>
              <Field label={tGenerated("username")}><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span><Input className="pl-7" value={username} onChange={(event) => { setUsername(event.target.value.replace(/[^a-zA-Z0-9._]/g, "")); setIsDirty(true) }} minLength={3} maxLength={30} required /></div></Field>
              <Field label={tGenerated("emailAddress")} icon={<EnvelopeSimple size={14} />}><Input type="email" value={account.user.email ?? ""} readOnly aria-readonly="true" className="bg-muted/40" /></Field>
              <Field label={tGenerated("phoneNumber")}><Input type="tel" value={phone} onChange={(event) => { setPhone(event.target.value); setIsDirty(true) }} placeholder="+855 12 345 678" maxLength={20} /></Field>
              <Field label={tGenerated("provinceCity")}><Select value={provinceId?.toString()} onValueChange={(value) => { setProvinceId(Number(value)); setDistrictId(undefined); setIsDirty(true) }}><SelectTrigger><SelectValue placeholder={provinces.isLoading ? tGenerated("loadingProvinces") : tGenerated("selectProvince_1cb975")} /></SelectTrigger><SelectContent>{provinces.data?.map((province) => <SelectItem key={province.id} value={String(province.id)}>{getLocalizedName(province)}</SelectItem>)}</SelectContent></Select></Field>
              <Field label={tGenerated("districtKhan")}><Select value={districtId?.toString()} disabled={!provinceId || districts.isLoading} onValueChange={(value) => { setDistrictId(Number(value)); setIsDirty(true) }}><SelectTrigger><SelectValue placeholder={!selectedProvince ? tGenerated("selectProvinceFirst") : districts.isLoading ? tGenerated("loadingDistricts") : tGenerated("selectDistrictKhan")} /></SelectTrigger><SelectContent>{districts.data?.map((district) => <SelectItem key={district.id} value={String(district.id)}>{getLocalizedName(district)}</SelectItem>)}</SelectContent></Select></Field>
            </div>
            <Field label={tGenerated("bioDescription")}><Textarea value={bio} onChange={(event) => { setBio(event.target.value); setIsDirty(true) }} rows={4} maxLength={1000} placeholder={tGenerated("tellBuyersAboutYourselfOrYourStore")} /></Field>
          </section>

          <Separator />
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold sm:text-base"><Storefront size={16} className="text-primary" /><LocalizedText id="sellerProfile" /></h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={tGenerated("sellerType")}><Select value={sellerType} onValueChange={(value) => { setSellerType(value as SellerType); setIsDirty(true) }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="individual"><LocalizedText id="individualSeller" /></SelectItem><SelectItem value="business"><LocalizedText id="businessStore" /></SelectItem><SelectItem value="dealer"><LocalizedText id="dealer" /></SelectItem></SelectContent></Select></Field>
              {sellerType !== "individual" && <Field label={tGenerated("businessStoreName")}><Input value={shopName} onChange={(event) => { setShopName(event.target.value); setIsDirty(true) }} minLength={2} maxLength={100} required /></Field>}
            </div>
          </section>

          <div className="flex flex-col items-stretch justify-between gap-3 border-t pt-4 sm:flex-row sm:items-center">
            <p className="min-h-5 text-xs text-muted-foreground">{isDirty ? tGenerated("youHaveUnsavedChanges") : current ? tGenerated("profileUpToDate") : tGenerated("completeProfileToSell")}</p>
            <Button type="submit" disabled={!canSave} className="h-10 gap-2 px-6 font-bold">
              {saveProfile.isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} weight="fill" />}
              {saveProfile.isPending ? tGenerated("saving") : tGenerated("saveChanges")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

function Field({ label, icon, children }: { label: string; icon?: ReactNode; children: ReactNode }) {
  return <div className="space-y-1.5"><label className="flex items-center gap-1.5 text-xs font-bold">{icon}<span>{label}</span></label>{children}</div>
}

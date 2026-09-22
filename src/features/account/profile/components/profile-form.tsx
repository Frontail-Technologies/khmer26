"use client"

import { useState, useRef, type ChangeEvent, type FormEvent } from "react"
import {
  Camera,
  Trash,
  CheckCircle,
  User,
  EnvelopeSimple,
  Phone,
  Storefront,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { DEMO_ACCOUNT_PROFILE } from "../../data/demo-account-data"
import type { AccountProfileData } from "../../types"

const PROVINCES = [
  "Phnom Penh",
  "Siem Reap",
  "Battambang",
  "Kandal",
  "Sihanoukville",
  "Kampot",
  "Kampong Cham",
  "Banteay Meanchey",
  "Takeo",
  "Prey Veng",
  "Svay Rieng",
]

interface ProfileFormProps {
  initialProfile?: AccountProfileData
}

export function ProfileForm({
  initialProfile = DEMO_ACCOUNT_PROFILE,
}: ProfileFormProps) {
  const [profile, setProfile] = useState<AccountProfileData>(initialProfile)
  const [isDirty, setIsDirty] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setProfile((prev) => ({ ...prev, avatarUrl: previewUrl }))
      setIsDirty(true)
      setIsSaved(false)
    }
  }

  const handleRemovePhoto = () => {
    setProfile((prev) => ({ ...prev, avatarUrl: "" }))
    setIsDirty(true)
    setIsSaved(false)
  }

  const handleChange = <K extends keyof AccountProfileData>(
    field: K,
    value: AccountProfileData[K]
  ) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
    setIsDirty(true)
    setIsSaved(false)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setIsDirty(false)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-2xs space-y-6">
        <CardContent className="p-0 space-y-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <Avatar className="h-18 w-18 sm:h-20 sm:w-20 rounded-full border-2 border-border/80 shadow-xs shrink-0">
              <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
              <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                {profile.fullName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="min-w-0">
                <h3 className="font-bold text-base sm:text-lg text-foreground truncate leading-tight">
                  {profile.fullName}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  @{profile.username}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-7 px-2.5 text-xs font-semibold gap-1.5 rounded-lg"
                >
                  <Camera size={14} />
                  <span>Change Photo</span>
                </Button>

                {profile.avatarUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={handleRemovePhoto}
                    className="h-7 px-2 text-xs font-semibold text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 rounded-lg"
                  >
                    <Trash size={14} />
                    <span>Remove</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Separator className="bg-border/60" />

          <div className="space-y-4">
            <div className="space-y-0.5">
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                Basic Information
              </h3>
              <p className="text-xs text-muted-foreground">
                Your primary account credentials and contact info.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <User size={14} className="text-muted-foreground" />
                  <span>Full Name</span>
                </label>
                <Input
                  value={profile.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Your full name"
                  className="h-9 sm:h-10 text-xs sm:text-sm bg-background"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold">
                    @
                  </span>
                  <Input
                    value={profile.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    placeholder="username"
                    className="pl-7 h-9 sm:h-10 text-xs sm:text-sm bg-background"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <EnvelopeSimple size={14} className="text-muted-foreground" />
                    <span>Email Address</span>
                  </label>
                  {profile.emailVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary">
                      <CheckCircle size={13} weight="fill" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                  className="h-9 sm:h-10 text-xs sm:text-sm bg-background"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Phone size={14} className="text-muted-foreground" />
                    <span>Phone Number</span>
                  </label>
                  {profile.phoneVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary">
                      <CheckCircle size={13} weight="fill" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
                <Input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+855 12 345 678"
                  className="h-9 sm:h-10 text-xs sm:text-sm bg-background"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Province / City
                </label>
                <Select
                  value={profile.province}
                  onValueChange={(val) => handleChange("province", val as string)}
                >
                  <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm bg-background">
                    <SelectValue placeholder="Select Province" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((prov) => (
                      <SelectItem key={prov} value={prov} className="text-xs">
                        {prov}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  District / Khan
                </label>
                <Input
                  value={profile.district || ""}
                  onChange={(e) => handleChange("district", e.target.value)}
                  placeholder="e.g. Chamkarmon"
                  className="h-9 sm:h-10 text-xs sm:text-sm bg-background"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-foreground">
                Bio / Description
              </label>
              <Textarea
                value={profile.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Tell buyers a little about yourself or your store..."
                rows={3}
                className="text-xs sm:text-sm bg-background resize-none leading-relaxed"
              />
            </div>
          </div>

          <Separator className="bg-border/60" />

          <div className="space-y-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-primary">
                <Storefront size={16} weight="fill" />
                <h3 className="text-sm sm:text-base font-bold text-foreground">
                  Seller Profile
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Control how buyers see you on Khmer26.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Seller Type
                </label>
                <Select
                  value={profile.sellerType}
                  onValueChange={(val) =>
                    handleChange("sellerType", val as "individual" | "business")
                  }
                >
                  <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm bg-background">
                    <SelectValue placeholder="Seller Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual" className="text-xs">
                      Individual Seller
                    </SelectItem>
                    <SelectItem value="business" className="text-xs">
                      Business / Store
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {profile.sellerType === "business" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Business / Store Name
                  </label>
                  <Input
                    value={profile.businessName || ""}
                    onChange={(e) => handleChange("businessName", e.target.value)}
                    placeholder="e.g. Sokha Auto & Tech"
                    className="h-9 sm:h-10 text-xs sm:text-sm bg-background"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-border/60">
            <div className="min-h-5 flex items-center">
              {isSaved ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary animate-in fade-in">
                  <CheckCircle size={15} weight="fill" />
                  <span>Profile changes saved successfully!</span>
                </span>
              ) : isDirty ? (
                <span className="text-[11px] text-muted-foreground font-medium">
                  You have unsaved changes
                </span>
              ) : null}
            </div>

            <Button
              type="submit"
              disabled={!isDirty && !isSaved}
              className="w-full sm:w-auto h-10 px-6 font-bold text-xs sm:text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-xs shrink-0"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

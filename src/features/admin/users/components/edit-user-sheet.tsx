"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
} from "@/components/ui/select"
import type { AdminUserDetail } from "../types"

const PROVINCE_OPTIONS = [
  { value: "Phnom Penh", label: "Phnom Penh" },
  { value: "Siem Reap", label: "Siem Reap" },
  { value: "Battambang", label: "Battambang" },
  { value: "Kandal", label: "Kandal" },
  { value: "Preah Sihanouk", label: "Preah Sihanouk" },
  { value: "Kampot", label: "Kampot" },
  { value: "Kampong Cham", label: "Kampong Cham" },
  { value: "Banteay Meanchey", label: "Banteay Meanchey" },
  { value: "Takeo", label: "Takeo" },
  { value: "Prey Veng", label: "Prey Veng" },
  { value: "Svay Rieng", label: "Svay Rieng" },
  { value: "Kampong Speu", label: "Kampong Speu" },
  { value: "Kampong Thom", label: "Kampong Thom" },
  { value: "Pursat", label: "Pursat" },
  { value: "Koh Kong", label: "Koh Kong" },
  { value: "Kratie", label: "Kratie" },
  { value: "Mondulkiri", label: "Mondulkiri" },
  { value: "Ratanakiri", label: "Ratanakiri" },
  { value: "Stung Treng", label: "Stung Treng" },
  { value: "Preah Vihear", label: "Preah Vihear" },
  { value: "Oddar Meanchey", label: "Oddar Meanchey" },
  { value: "Kep", label: "Kep" },
  { value: "Pailin", label: "Pailin" },
  { value: "Tboung Khmum", label: "Tboung Khmum" },
]

interface EditUserSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: AdminUserDetail
  onSave: (updated: Partial<AdminUserDetail>) => void
}

function EditUserForm({
  user,
  onCancel,
  onSave,
}: {
  user: AdminUserDetail
  onCancel: () => void
  onSave: (updated: Partial<AdminUserDetail>) => void
}) {
  const isSeller = user.accountType === "seller" || user.accountType === "business" || user.accountType === "dealer"

  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone)
  const [province, setProvince] = useState(user.province)
  const [location, setLocation] = useState(user.location)
  const [address, setAddress] = useState(user.address ?? "")
  const [bio, setBio] = useState(user.bio ?? "")
  const [businessName, setBusinessName] = useState(user.businessName ?? "")
  const [registeredBusinessNumber, setRegisteredBusinessNumber] = useState(
    user.registeredBusinessNumber ?? ""
  )

  const isDirty =
    name !== user.name ||
    email !== user.email ||
    phone !== user.phone ||
    province !== user.province ||
    location !== user.location ||
    address !== (user.address ?? "") ||
    bio !== (user.bio ?? "") ||
    businessName !== (user.businessName ?? "") ||
    registeredBusinessNumber !== (user.registeredBusinessNumber ?? "")

  const isValid = name.trim().length > 0 && (!email || email.includes("@"))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || !isDirty) return

    onSave({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      province,
      location: location.trim() || province,
      address: address.trim() || undefined,
      bio: bio.trim() || undefined,
      businessName: isSeller && businessName.trim() ? businessName.trim() : undefined,
      registeredBusinessNumber:
        isSeller && registeredBusinessNumber.trim()
          ? registeredBusinessNumber.trim()
          : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        <Field>
          <FieldLabel required>Full Name</FieldLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="User display name"
            className="h-9 text-xs"
            required
          />
        </Field>

        {isSeller && (
          <Field>
            <FieldLabel>Business / Store Name</FieldLabel>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Official business name (optional)"
              className="h-9 text-xs"
            />
          </Field>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="h-9 text-xs"
            />
          </Field>

          <Field>
            <FieldLabel>Phone</FieldLabel>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+855 12 345 678"
              className="h-9 text-xs"
            />
          </Field>
        </div>

        <Field>
          <FieldLabel>Province</FieldLabel>
          <Select
            value={province}
            onValueChange={(val) => {
              if (val) setProvince(val)
            }}
            items={PROVINCE_OPTIONS}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue>
                {getSelectOptionLabel(PROVINCE_OPTIONS, province, "Select province")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-56">
              {PROVINCE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>Location / Area</FieldLabel>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="District, Khan, or City Area"
            className="h-9 text-xs"
          />
        </Field>

        <Field>
          <FieldLabel>Street Address</FieldLabel>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street address / House number"
            className="h-9 text-xs"
          />
        </Field>

        {isSeller && (
          <Field>
            <FieldLabel>Business Registration No.</FieldLabel>
            <Input
              value={registeredBusinessNumber}
              onChange={(e) => setRegisteredBusinessNumber(e.target.value)}
              placeholder="MOC / Tax registration number"
              className="h-9 text-xs"
            />
          </Field>
        )}

        <Field>
          <FieldLabel>Bio / About</FieldLabel>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="User or business biography..."
            rows={3}
            className="text-xs resize-none"
          />
        </Field>
      </div>

      <SheetFooter className="p-4 border-t border-border/60 bg-muted/20 flex flex-row items-center justify-end gap-2 shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="text-xs cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={!isDirty || !isValid}
          className="text-xs font-semibold cursor-pointer"
        >
          Save Changes
        </Button>
      </SheetFooter>
    </form>
  )
}

export function EditUserSheet({
  open,
  onOpenChange,
  user,
  onSave,
}: EditUserSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col h-full overflow-hidden bg-card"
      >
        <SheetHeader className="p-4 sm:p-5 border-b border-border/60">
          <SheetTitle className="text-sm font-bold text-foreground">
            Edit Account
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Update account information for {user.name} ({user.id})
          </SheetDescription>
        </SheetHeader>

        {open && (
          <EditUserForm
            key={`${user.id}-${open}`}
            user={user}
            onCancel={() => onOpenChange(false)}
            onSave={(updated) => {
              onSave(updated)
              onOpenChange(false)
            }}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}

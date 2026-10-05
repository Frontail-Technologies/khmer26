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

const SELLER_TYPE_OPTIONS = [
  { value: "individual", label: "Individual" },
  { value: "business", label: "Business" },
  { value: "dealer", label: "Dealer" },
]

const ROLE_OPTIONS = [
  { value: "user", label: "Standard User" },
  { value: "admin", label: "Administrator" },
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

  const [email, setEmail] = useState(user.email)
  const [role, setRole] = useState<"user" | "admin">(user.role || "user")
  const [bio, setBio] = useState(user.bio ?? "")
  const [businessName, setBusinessName] = useState(user.businessName ?? "")
  const [sellerType, setSellerType] = useState<"individual" | "business" | "dealer">(
    user.accountType === "dealer" ? "dealer" : user.accountType === "business" ? "business" : "individual"
  )

  const isDirty =
    email !== user.email ||
    role !== (user.role || "user") ||
    bio !== (user.bio ?? "") ||
    businessName !== (user.businessName ?? "") ||
    sellerType !== (user.accountType === "dealer" ? "dealer" : user.accountType === "business" ? "business" : "individual")

  const isValid = (!email || email.includes("@")) && (!isSeller || businessName.trim().length > 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || !isDirty) return

    onSave({
      email: email.trim() || undefined,
      role,
      bio: bio.trim() || undefined,
      businessName: isSeller && businessName.trim() ? businessName.trim() : undefined,
      accountType: sellerType === "individual" ? "seller" : sellerType,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
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
          <FieldLabel>System Role</FieldLabel>
          <Select
            value={role}
            onValueChange={(val) => setRole((val as "user" | "admin") ?? "user")}
            items={ROLE_OPTIONS}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue>
                {getSelectOptionLabel(ROLE_OPTIONS, role, "Standard User")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {isSeller && (
          <Field>
            <FieldLabel>Seller Type</FieldLabel>
            <Select
              value={sellerType}
              onValueChange={(val) => setSellerType((val as "individual" | "business" | "dealer") ?? "individual")}
              items={SELLER_TYPE_OPTIONS}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue>
                  {getSelectOptionLabel(SELLER_TYPE_OPTIONS, sellerType, "Individual")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SELLER_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            Update account information for {user.name}
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

"use client"

import { useState } from "react"
import { Sparkle, Star, Lightning, PencilSimple, Plus, Power, Trash } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatusBadge } from "@/components/shared/status-badge"
import {
  useAdminPromotionPackages,
} from "../hooks/promotions.queries"
import {
  useCreatePromotionPackage,
  useUpdatePromotionPackage,
  useTogglePromotionPackageActive,
  useDeletePromotionPackage,
} from "../hooks/promotions.mutations"
import type { AdminPromotionPackageRow } from "../api/promotions.api"

const TYPE_ICONS: Record<string, React.ElementType> = {
  featured: Sparkle,
  top_listing: Star,
  urgent: Lightning,
}

const TYPE_LABELS: Record<string, string> = {
  featured: "Featured Listing",
  top_listing: "Top Listing Boost",
  urgent: "Urgent Badge",
}

const TYPE_BADGE_CLASS: Record<string, string> = {
  featured: "bg-primary/10 text-primary border-primary/20",
  top_listing: "bg-accent/10 text-accent border-accent/20",
  urgent: "bg-destructive/10 text-destructive border-destructive/20",
}

interface PackageFormState {
  promotionType: "featured" | "top_listing" | "urgent"
  name: string
  description: string
  durationDays: string
  price: string
  currency: "USD" | "KHR"
  isActive: boolean
}

const EMPTY_FORM: PackageFormState = {
  promotionType: "featured",
  name: "",
  description: "",
  durationDays: "7",
  price: "",
  currency: "USD",
  isActive: true,
}

function toFormState(pkg: AdminPromotionPackageRow): PackageFormState {
  return {
    promotionType: pkg.promotionType,
    name: pkg.name,
    description: pkg.description ?? "",
    durationDays: String(pkg.durationDays),
    price: String(pkg.price),
    currency: pkg.currency,
    isActive: pkg.isActive,
  }
}

export function PackageCatalog() {
  const { data: packages = [], isLoading } = useAdminPromotionPackages()
  const createPackage = useCreatePromotionPackage()
  const updatePackage = useUpdatePromotionPackage()
  const toggleActive = useTogglePromotionPackageActive()

  const deletePackage = useDeletePromotionPackage()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPkg, setEditingPkg] = useState<AdminPromotionPackageRow | null>(null)
  const [form, setForm] = useState<PackageFormState>(EMPTY_FORM)

  const handleOpenCreate = () => {
    setEditingPkg(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  const handleOpenEdit = (pkg: AdminPromotionPackageRow) => {
    setEditingPkg(pkg)
    setForm(toFormState(pkg))
    setDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      promotionType: form.promotionType,
      name: form.name.trim(),
      description: form.description.trim() || null,
      durationDays: Number(form.durationDays),
      price: Number(form.price),
      currency: form.currency,
      isActive: form.isActive,
    }
    if (editingPkg) {
      updatePackage.mutate(
        { id: editingPkg.id, data: payload },
        { onSuccess: () => setDialogOpen(false) }
      )
    } else {
      createPackage.mutate(payload, { onSuccess: () => setDialogOpen(false) })
    }
  }

  const isPending = createPackage.isPending || updatePackage.isPending

  return (
    <div className="space-y-3.5 sm:space-y-4">
      <div className="min-w-0 rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border/60">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Ad Packages</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Configure packages sellers can purchase to boost their listings.
            </p>
          </div>
          <Button size="sm" className="text-xs font-semibold gap-1.5" onClick={handleOpenCreate}>
            <Plus size={13} />
            New Package
          </Button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Loading packages…</div>
        ) : packages.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No packages yet. Create one to let sellers promote their listings.
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {packages.map((pkg) => {
              const Icon = TYPE_ICONS[pkg.promotionType] ?? Sparkle
              const badgeClass = TYPE_BADGE_CLASS[pkg.promotionType] ?? ""
              return (
                <div key={pkg.id} className="flex items-center gap-3 px-3 sm:px-4 py-3.5">
                  <div className={`flex-shrink-0 rounded-md p-1.5 border ${badgeClass}`}>
                    <Icon size={16} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-foreground">{pkg.name}</span>
                      <Badge variant="outline" className={`text-[10px] border ${badgeClass}`}>
                        {TYPE_LABELS[pkg.promotionType] ?? pkg.promotionType}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-[11px] text-muted-foreground">
                        {pkg.durationDays}d · {pkg.currency} {Number(pkg.price).toFixed(2)}
                      </span>
                      {pkg.description && (
                        <span className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                          {pkg.description}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <StatusBadge
                      label={pkg.isActive ? "Active" : "Inactive"}
                      tone={pkg.isActive ? "success" : "neutral"}
                      size="sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className={`size-7 ${pkg.isActive ? "text-success hover:text-destructive hover:bg-destructive/10" : "text-muted-foreground hover:text-success hover:bg-success/10"}`}
                      aria-label={pkg.isActive ? "Deactivate package" : "Activate package"}
                      disabled={toggleActive.isPending}
                      onClick={() => toggleActive.mutate({ id: pkg.id, isActive: pkg.isActive })}
                    >
                      <Power size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="size-7 text-muted-foreground hover:text-foreground"
                      aria-label="Edit package"
                      onClick={() => handleOpenEdit(pkg)}
                    >
                      <PencilSimple size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="size-7 text-destructive hover:bg-destructive/10"
                      aria-label="Delete package"
                      disabled={deletePackage.isPending}
                      onClick={() => deletePackage.mutate(pkg.id)}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>


      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) setDialogOpen(false) }}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-card">
          <DialogHeader className="p-4 sm:p-5 border-b border-border/60">
            <DialogTitle className="text-sm font-bold">
              {editingPkg ? "Edit Package" : "New Ad Package"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {editingPkg
                ? "Update the details for this promotion package."
                : "Create a new package sellers can purchase to promote their listings."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3.5 p-4 sm:p-5">
            <Field>
              <FieldLabel required>Package Name</FieldLabel>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Featured Listing — 7 Days"
                className="h-9 text-xs"
                required
              />
            </Field>

            <Field>
              <FieldLabel required>Type</FieldLabel>
              <Select
                value={form.promotionType}
                onValueChange={(v) => setForm((f) => ({ ...f, promotionType: v as PackageFormState["promotionType"] }))}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured" className="text-xs">Featured Listing</SelectItem>
                  <SelectItem value="top_listing" className="text-xs">Top Listing Boost</SelectItem>
                  <SelectItem value="urgent" className="text-xs">Urgent Badge</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel required>Duration (days)</FieldLabel>
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={form.durationDays}
                  onChange={(e) => setForm((f) => ({ ...f, durationDays: e.target.value }))}
                  className="h-9 text-xs"
                  required
                />
              </Field>

              <Field>
                <FieldLabel required>Price</FieldLabel>
                <div className="flex gap-1.5">
                  <Select
                    value={form.currency}
                    onValueChange={(v) => setForm((f) => ({ ...f, currency: v as "USD" | "KHR" }))}
                  >
                    <SelectTrigger className="h-9 text-xs w-20 flex-shrink-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD" className="text-xs">USD</SelectItem>
                      <SelectItem value="KHR" className="text-xs">KHR</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="0.00"
                    className="h-9 text-xs flex-1"
                    required
                  />
                </div>
              </Field>
            </div>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Optional short description shown to sellers."
                rows={2}
                className="text-xs resize-none"
              />
            </Field>

            <DialogFooter className="pt-4 border-t border-border/60 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 px-4 sm:px-5 py-3 bg-muted/20 flex flex-row items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(false)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending || !form.name.trim() || !form.price || !form.durationDays}
                className="text-xs font-semibold cursor-pointer"
              >
                {isPending ? (editingPkg ? "Saving…" : "Creating…") : (editingPkg ? "Save Changes" : "Create Package")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

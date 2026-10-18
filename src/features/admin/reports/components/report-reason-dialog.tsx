"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { BilingualField } from "@/components/admin/bilingual-field"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
} from "@/components/ui/select"
import type { AdminReportReasonItem, AdminReportTargetType } from "../types"

interface ReportReasonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reason?: AdminReportReasonItem | null
  onSave: (reason: AdminReportReasonItem) => void
}

const TARGET_OPTIONS: { value: AdminReportTargetType; label: string }[] = [
  { value: "listing", label: "Listings" },
  { value: "user", label: "Users & Sellers" },
  { value: "chat", label: "Chats & Messages" },
]

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

function ReportReasonForm({
  reason,
  onSave,
  onCancel,
}: {
  reason?: AdminReportReasonItem | null
  onSave: (reason: AdminReportReasonItem) => void
  onCancel: () => void
}) {
  const [label, setLabel] = useState(reason?.label ?? "")
  const [labelKm, setLabelKm] = useState(reason?.labelKm ?? "")
  const [descriptionKm, setDescriptionKm] = useState(reason?.descriptionKm ?? "")
  const [description, setDescription] = useState(reason?.description ?? "")
  const [appliesTo, setAppliesTo] = useState<AdminReportTargetType[]>(
    reason?.appliesTo ?? ["listing"]
  )
  const [isActive, setIsActive] = useState(reason?.isActive ?? true)

  const toggleTarget = (target: AdminReportTargetType) => {
    if (appliesTo.includes(target)) {
      if (appliesTo.length > 1) {
        setAppliesTo(appliesTo.filter((t) => t !== target))
      }
    } else {
      setAppliesTo([...appliesTo, target])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!label.trim()) return
    onSave({
      id: reason ? reason.id : `RSN-${Date.now().toString().slice(-4)}`,
      label: label.trim(),
      labelKm: labelKm.trim() || null,
      description: description.trim() || undefined,
      descriptionKm: descriptionKm.trim() || null,
      appliesTo,
      isActive,
      createdAt: reason?.createdAt || new Date().toISOString().split("T")[0],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader className="space-y-1.5 text-left">
        <DialogTitle className="text-sm sm:text-base">
          {reason ? "Edit Report Reason" : "Add Report Reason"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-1 text-xs">
        <BilingualField
          id="reason-title"
          label="Title"
          required
          valueEn={label}
          valueKm={labelKm}
          onChangeEn={setLabel}
          onChangeKm={setLabelKm}
          placeholderEn="e.g. Misleading Description"
          maxLength={100}
        />

        <BilingualField
          id="reason-description"
          label="Description"
          multiline
          rows={3}
          valueEn={description}
          valueKm={descriptionKm}
          onChangeEn={setDescription}
          onChangeKm={setDescriptionKm}
          placeholderEn="When users should pick this reason"
          maxLength={500}
        />

        <Field>
          <FieldLabel required>Applies To</FieldLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {TARGET_OPTIONS.map((opt) => {
              const checked = appliesTo.includes(opt.value)
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 p-2 rounded-lg border border-border/70 bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleTarget(opt.value)}
                  />
                  <span className="text-xs font-medium text-foreground">{opt.label}</span>
                </label>
              )
            })}
          </div>
        </Field>

        <Field>
          <FieldLabel required>Status</FieldLabel>
          <Select
            value={isActive ? "active" : "inactive"}
            items={STATUS_OPTIONS}
            onValueChange={(val) => setIsActive(val === "active")}
          >
            <SelectTrigger className="h-9 text-xs w-full rounded-lg">
              <SelectValue>
                {(val) => getSelectOptionLabel(STATUS_OPTIONS, val, "Active")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <DialogFooter className="flex flex-row gap-2 pt-2 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="flex-1 sm:flex-initial h-9 px-4 text-xs font-semibold rounded-lg cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          className="flex-1 sm:flex-initial h-9 px-4 text-xs font-bold rounded-lg cursor-pointer"
        >
          {reason ? "Save Changes" : "Create Reason"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function ReportReasonDialog({
  open,
  onOpenChange,
  reason,
  onSave,
}: ReportReasonDialogProps) {
  const handleSave = (saved: AdminReportReasonItem) => {
    onSave(saved)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-5 rounded-xl bg-card border-0 shadow-lg">
        <ReportReasonForm
          key={reason?.id ?? "new"}
          reason={reason}
          onSave={handleSave}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

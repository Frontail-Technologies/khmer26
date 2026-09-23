"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
} from "@/components/ui/select"
import { Plus, X } from "@phosphor-icons/react"
import type { FieldType, ListingField } from "@/features/admin/categories/types"

interface CreateFieldDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (field: ListingField) => void
  initialField?: ListingField | null
}

const FIELD_TYPE_OPTIONS = [
  { value: "text", label: "Text Input" },
  { value: "number", label: "Numeric" },
  { value: "select", label: "Dropdown Select" },
  { value: "boolean", label: "Boolean Switch" },
]

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export function CreateFieldDialog({
  open,
  onOpenChange,
  onSave,
  initialField,
}: CreateFieldDialogProps) {
  const [label, setLabel] = useState(initialField?.label ?? "")
  const [key, setKey] = useState(initialField?.key ?? "")
  const [type, setType] = useState<FieldType>(initialField?.type ?? "text")
  const [unit, setUnit] = useState(initialField?.unit ?? "")
  const [placeholder, setPlaceholder] = useState(initialField?.placeholder ?? "")
  const [isActive, setIsActive] = useState(initialField?.isActive ?? true)
  const [options, setOptions] = useState<string[]>(initialField?.options ?? ["Option 1", "Option 2"])
  const [newOptionInput, setNewOptionInput] = useState("")

  const handleLabelChange = (val: string) => {
    setLabel(val)
    if (!initialField && (!key || key === label.toLowerCase().replace(/[^a-z0-9]/g, ""))) {
      const camel = val
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
      setKey(camel)
    }
  }

  const handleAddOption = () => {
    if (newOptionInput.trim()) {
      setOptions([...options, newOptionInput.trim()])
      setNewOptionInput("")
    }
  }

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const handleClose = () => {
    if (!initialField) {
      setLabel("")
      setKey("")
      setType("text")
      setUnit("")
      setPlaceholder("")
      setOptions(["Option 1", "Option 2"])
      setIsActive(true)
    }
    onOpenChange(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSave) {
      onSave({
        id: initialField?.id ?? `f-${Date.now()}`,
        key: key.trim(),
        label: label.trim(),
        type,
        options: type === "select" ? options : undefined,
        unit: type === "number" && unit ? unit.trim() : undefined,
        placeholder: placeholder ? placeholder.trim() : undefined,
        isActive,
        usedInCount: initialField?.usedInCount ?? 0,
      })
    }
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden rounded-xl border-0 shadow-lg bg-card">
        <DialogHeader className="p-5 pb-4 border-b border-border/60 bg-muted/20">
          <DialogTitle className="text-base font-bold text-foreground">
            {initialField ? "Edit Field Definition" : "Create Reusable Field"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Define a global listing attribute that can be assigned to multiple categories.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel required>Field Label</FieldLabel>
              <Input
                type="text"
                placeholder="e.g. Engine Capacity"
                value={label}
                onChange={(e) => handleLabelChange(e.target.value)}
                required
                className="h-9.5 text-xs rounded-lg"
              />
            </Field>

            <Field>
              <FieldLabel required>Internal Key</FieldLabel>
              <Input
                type="text"
                placeholder="e.g. engineCapacity"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                required
                className="h-9.5 text-xs font-mono rounded-lg"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Field Type</FieldLabel>
              <Select
                items={FIELD_TYPE_OPTIONS}
                value={type}
                onValueChange={(val) => setType((val as FieldType) ?? "text")}
              >
                <SelectTrigger size="sm" className="h-9.5 text-xs rounded-lg">
                  <SelectValue placeholder="Field Type">
                    {(val) => getSelectOptionLabel(FIELD_TYPE_OPTIONS, val, "Field Type")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select
                items={STATUS_OPTIONS}
                value={isActive ? "active" : "inactive"}
                onValueChange={(val) => setIsActive(val === "active")}
              >
                <SelectTrigger size="sm" className="h-9.5 text-xs rounded-lg">
                  <SelectValue placeholder="Status">
                    {(val) => getSelectOptionLabel(STATUS_OPTIONS, val, "Status")}
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

          {type === "number" && (
            <Field>
              <FieldLabel>Unit (Optional)</FieldLabel>
              <Input
                type="text"
                placeholder="e.g. km, cc, sqm, HP"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="h-9.5 text-xs rounded-lg"
              />
            </Field>
          )}

          {type === "text" && (
            <Field>
              <FieldLabel>Placeholder Text</FieldLabel>
              <Input
                type="text"
                placeholder="e.g. Prius, Camry, Ranger"
                value={placeholder}
                onChange={(e) => setPlaceholder(e.target.value)}
                className="h-9.5 text-xs rounded-lg"
              />
            </Field>
          )}

          {type === "select" && (
            <div className="space-y-2 pt-2 border-t border-border/60">
              <FieldLabel>Dropdown Options ({options.length})</FieldLabel>

              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Add option..."
                  value={newOptionInput}
                  onChange={(e) => setNewOptionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddOption()
                    }
                  }}
                  className="h-9 text-xs rounded-lg flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddOption}
                  className="h-9 px-3.5 text-xs font-bold rounded-lg cursor-pointer"
                >
                  <Plus size={13} weight="bold" className="mr-1" />
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2.5 bg-muted/20 rounded-lg border border-border/60">
                {options.map((opt, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background border border-border/60 text-xs font-medium text-foreground shadow-2xs"
                  >
                    <span>{opt}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="size-3.5 rounded-full hover:bg-destructive/15 hover:text-destructive flex items-center justify-center text-muted-foreground transition-colors cursor-pointer"
                    >
                      <X size={10} weight="bold" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="h-9 px-3.5 text-xs rounded-lg cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-9 px-4 text-xs font-bold rounded-lg cursor-pointer"
            >
              {initialField ? "Save Changes" : "Create Field"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

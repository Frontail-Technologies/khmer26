"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { BilingualField } from "@/components/admin/bilingual-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
} from "@/components/ui/select"
import { CategoryImageUploader } from "./category-image-uploader"
import { useCreateCategory } from "../hooks/categories.mutations"
import type { AdminCategoryItem } from "../types"

interface CreateCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentCategories: AdminCategoryItem[]
  defaultParentId?: string
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
  parentCategories,
  defaultParentId = "none",
}: CreateCategoryDialogProps) {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [parentId, setParentId] = useState(defaultParentId)
  const [nameKm, setNameKm] = useState("")
  const [imageUrl, setImageUrl] = useState<string | undefined>()
  const [sortOrder, setSortOrder] = useState("1")
  const [isActive, setIsActive] = useState("active")
  const [wasOpen, setWasOpen] = useState(open)
  const createCategory = useCreateCategory()

  // Start every opening from a clean form with the caller's parent preselected.
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setName("")
      setSlug("")
      setParentId(defaultParentId)
      setNameKm("")
      setImageUrl(undefined)
      setSortOrder("1")
      setIsActive("active")
    }
  }

  const parentOptions = [
    { value: "none", label: "None (Root Category)" },
    ...parentCategories.map((c) => ({ value: c.id, label: c.name })),
  ]

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ]

  const handleNameChange = (val: string) => {
    setName(val)
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      )
    }
  }

  const handleClose = () => {
    setName("")
    setSlug("")
    setParentId(defaultParentId)
    setNameKm("")
    setImageUrl(undefined)
    setSortOrder("1")
    setIsActive("active")
    onOpenChange(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !slug.trim()) return
    createCategory.mutate(
      {
        nameEn: name.trim(),
        nameKm: nameKm.trim() || null,
        slug: slug.trim(),
        parentId: parentId === "none" ? null : parentId,
        displayOrder: Number(sortOrder) || undefined,
        isActive: isActive === "active",
      },
      { onSuccess: handleClose }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden rounded-xl border-0 shadow-lg bg-card">
        <DialogHeader className="p-5 pb-4 border-b border-border/60 bg-muted/20">
          <DialogTitle className="text-base font-bold text-foreground">
            {defaultParentId !== "none" ? "Add Subcategory" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <CategoryImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            label={defaultParentId !== "none" ? "Subcategory Image" : "Category Image"}
          />

          <BilingualField
            id="category-name"
            label="Name"
            required
            valueEn={name}
            valueKm={nameKm}
            onChangeEn={handleNameChange}
            onChangeKm={setNameKm}
            placeholderEn="e.g. Electric Vehicles"
          />

          <Field>
            <FieldLabel required>URL Slug</FieldLabel>
            <Input
              type="text"
              placeholder="e.g. electric-vehicles"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="h-9.5 text-xs font-mono rounded-lg"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field className="sm:col-span-1">
              <FieldLabel>Parent Category</FieldLabel>
              <Select
                items={parentOptions}
                value={parentId}
                onValueChange={(val) => setParentId(val ?? "none")}
              >
                <SelectTrigger size="sm" className="h-9.5 text-xs rounded-lg">
                  <SelectValue placeholder="Parent">
                    {(val) => getSelectOptionLabel(parentOptions, val, "Parent")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {parentOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field className="sm:col-span-1">
              <FieldLabel>Sort Order</FieldLabel>
              <Input
                type="number"
                min={1}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="h-9.5 text-xs rounded-lg"
              />
            </Field>

            <Field className="sm:col-span-1">
              <FieldLabel>Status</FieldLabel>
              <Select
                items={statusOptions}
                value={isActive}
                onValueChange={(val) => setIsActive(val ?? "active")}
              >
                <SelectTrigger size="sm" className="h-9.5 text-xs rounded-lg">
                  <SelectValue placeholder="Status">
                    {(val) => getSelectOptionLabel(statusOptions, val, "Status")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

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
              disabled={createCategory.isPending}
              className="h-9 px-4 text-xs font-bold rounded-lg cursor-pointer"
            >
              Create Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

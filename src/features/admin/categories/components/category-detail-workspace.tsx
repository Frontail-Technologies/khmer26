"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Folder,
  Plus,
  Sliders,
  ArrowRight,
} from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CategoryImageUploader } from "./category-image-uploader"
import { CreateCategoryDialog } from "./create-category-dialog"
import { getAssignedFieldsForCategory } from "@/features/admin/listing-fields/data/demo-listing-fields"
import type { AdminCategoryItem, AdminSubcategoryItem } from "../types"

interface CategoryDetailWorkspaceProps {
  category: AdminCategoryItem | (AdminSubcategoryItem & { parent?: AdminCategoryItem; subcategories?: AdminSubcategoryItem[] })
  parentCategory?: AdminCategoryItem | null
  allRootCategories: AdminCategoryItem[]
}

export function CategoryDetailWorkspace({
  category,
  parentCategory,
  allRootCategories,
}: CategoryDetailWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"general" | "subcategories">("general")
  const [name, setName] = useState(category.name)
  const [slug, setSlug] = useState(category.slug)
  const [parentId, setParentId] = useState(parentCategory?.id ?? "none")
  const [sortOrder, setSortOrder] = useState(String(category.sortOrder || 1))
  const [isActive, setIsActive] = useState(category.isActive)
  const [description, setDescription] = useState(
    "description" in category ? category.description : ""
  )
  const [imageUrl, setImageUrl] = useState<string | undefined>(category.imageUrl)
  const [isAddSubOpen, setIsAddSubOpen] = useState(false)

  const isRoot = !parentCategory && "subcategories" in category
  const subcategoriesList: AdminSubcategoryItem[] = "subcategories" in category ? category.subcategories || [] : []

  const assignedFields = getAssignedFieldsForCategory(category.slug || category.id)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} weight="bold" />
            <span>Back to Categories</span>
          </Link>

          <div className="flex items-center gap-2.5 pt-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              {category.name}
            </h1>
            <Badge
              variant="secondary"
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {parentCategory ? (
              <>
                <Link href={`/admin/categories/${parentCategory.id}`} className="hover:underline">
                  {parentCategory.name}
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">{category.name}</span>
              </>
            ) : (
              <span className="text-foreground font-medium">Root Category</span>
            )}
            <span>·</span>
            <span>{category.listingCount.toLocaleString()} listings</span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {category.slug && (
            <Button
              variant="outline"
              size="sm"
              render={<Link href={`/admin/listing-fields?category=${category.slug}`} />}
              className="h-9 px-3 text-xs font-bold gap-1.5 rounded-lg"
            >
              <Sliders size={14} weight="bold" />
              <span>Manage Listing Fields</span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-5">
          <Card className="rounded-xl border-0 bg-card shadow-2xs overflow-hidden">
            <div className="p-1 bg-muted/20 border-b border-border/60 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === "general"
                    ? "bg-card text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                General Settings
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("subcategories")}
                className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === "subcategories"
                    ? "bg-card text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Subcategories ({subcategoriesList.length})
              </button>
            </div>

            <CardContent className="p-4 sm:p-6">
              {activeTab === "general" ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <CategoryImageUploader
                    value={imageUrl}
                    onChange={setImageUrl}
                    label="Category Display Image"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel required>Category Name</FieldLabel>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="h-9.5 text-xs rounded-lg"
                      />
                    </Field>

                    <Field>
                      <FieldLabel required>URL Slug</FieldLabel>
                      <Input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        required
                        className="h-9.5 text-xs font-mono rounded-lg"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field className="sm:col-span-1">
                      <FieldLabel>Parent Category</FieldLabel>
                      <Select
                        items={[
                          { value: "none", label: "None (Root Category)" },
                          ...allRootCategories
                            .filter((c) => c.id !== category.id)
                            .map((c) => ({ value: c.id, label: c.name })),
                        ]}
                        value={parentId}
                        onValueChange={(val) => setParentId(val ?? "none")}
                      >
                        <SelectTrigger size="sm" className="h-9.5 text-xs rounded-lg">
                          <SelectValue placeholder="Parent">
                            {(val) =>
                              val === "none"
                                ? "None (Root Category)"
                                : allRootCategories.find((c) => c.id === val)?.name || "Parent"
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none" className="text-xs">
                            None (Root Category)
                          </SelectItem>
                          {allRootCategories
                            .filter((c) => c.id !== category.id)
                            .map((c) => (
                              <SelectItem key={c.id} value={c.id} className="text-xs">
                                {c.name}
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
                        items={[
                          { value: "active", label: "Active" },
                          { value: "inactive", label: "Inactive" },
                        ]}
                        value={isActive ? "active" : "inactive"}
                        onValueChange={(val) => setIsActive(val === "active")}
                      >
                        <SelectTrigger size="sm" className="h-9.5 text-xs rounded-lg">
                          <SelectValue placeholder="Status">
                            {(val) => (val === "active" ? "Active" : "Inactive")}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active" className="text-xs">
                            Active
                          </SelectItem>
                          <SelectItem value="inactive" className="text-xs">
                            Inactive
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel>Description</FieldLabel>
                    <Textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Category summary for directory and SEO..."
                      className="text-xs rounded-lg resize-none min-h-20"
                    />
                  </Field>

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      size="sm"
                      className="h-9 px-4 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Subcategories under this category taxonomy branch.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => setIsAddSubOpen(true)}
                      className="h-8 px-3 text-xs font-bold gap-1 rounded-lg cursor-pointer"
                    >
                      <Plus size={13} weight="bold" />
                      <span>Add Subcategory</span>
                    </Button>
                  </div>

                  {subcategoriesList.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-border/70 rounded-xl space-y-2">
                      <Folder size={28} weight="duotone" className="mx-auto text-muted-foreground/60" />
                      <p className="text-xs font-bold text-foreground">No subcategories assigned</p>
                      <p className="text-[11px] text-muted-foreground">
                        Add subcategories to organize listings and configure specific listing fields.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/60 border border-border/60 rounded-xl overflow-hidden">
                      {subcategoriesList.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between p-3 sm:px-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative size-9 rounded-lg overflow-hidden shrink-0 bg-muted border border-border/50">
                              {sub.imageUrl ? (
                                <Image
                                  src={sub.imageUrl}
                                  alt={sub.name}
                                  fill
                                  className="object-cover"
                                  sizes="36px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                  <Folder size={16} weight="duotone" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 space-y-0.5">
                              <p className="text-xs font-bold text-foreground truncate">{sub.name}</p>
                              <p className="text-[11px] text-muted-foreground font-mono">/{sub.slug}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[11px] font-semibold text-foreground/80 px-2 py-0.5 rounded-md bg-muted/60">
                              {sub.listingCount.toLocaleString()} ads
                            </span>

                            <Badge
                              variant="secondary"
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                sub.isActive
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {sub.isActive ? "Active" : "Inactive"}
                            </Badge>

                            <Button
                              variant="outline"
                              size="sm"
                              render={<Link href={`/admin/categories/${sub.id}`} />}
                              className="h-7 px-2.5 text-[11px] font-semibold rounded-lg"
                            >
                              <span>Edit</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <Card className="rounded-xl border-0 bg-card shadow-2xs overflow-hidden">
            <div className="p-4 pb-3 border-b border-border/60 flex items-center justify-between">
              <div className="space-y-0.5">
                <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Listing Fields
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  {isRoot
                    ? "Listing fields are configured per subcategory"
                    : `${assignedFields.length} fields assigned`}
                </p>
              </div>
              <Sliders size={16} weight="duotone" className="text-primary" />
            </div>

            <CardContent className="p-4 space-y-3.5">
              {isRoot ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Fields are attached to leaf subcategories where sellers post ads.
                  </p>

                  <div className="space-y-1.5">
                    {subcategoriesList.map((sub) => {
                      const count = getAssignedFieldsForCategory(sub.slug || sub.id).length
                      return (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-xs"
                        >
                          <span className="font-semibold text-foreground truncate">{sub.name}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-muted-foreground">
                              {count} {count === 1 ? "field" : "fields"}
                            </span>
                            <Link
                              href={`/admin/listing-fields?category=${sub.slug}`}
                              className="text-primary hover:underline text-[11px] font-bold"
                            >
                              Configure
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignedFields.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">
                      No custom fields attached to this subcategory yet.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {assignedFields.slice(0, 6).map(({ field, assignment }) => (
                        <span
                          key={field.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/60 text-foreground text-[11px] font-medium"
                        >
                          <span>{field.label}</span>
                          {assignment.required && (
                            <span className="text-destructive font-bold text-[10px]">*</span>
                          )}
                        </span>
                      ))}
                      {assignedFields.length > 6 && (
                        <span className="px-2 py-0.5 rounded-md bg-muted/40 text-muted-foreground text-[11px] font-semibold">
                          +{assignedFields.length - 6} more
                        </span>
                      )}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/admin/listing-fields?category=${category.slug || category.id}`} />}
                    className="w-full h-8 text-xs font-bold rounded-lg gap-1.5 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                  >
                    <span>Manage Listing Fields</span>
                    <ArrowRight size={12} weight="bold" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateCategoryDialog
        open={isAddSubOpen}
        onOpenChange={setIsAddSubOpen}
        parentCategories={allRootCategories}
        defaultParentId={category.id}
      />
    </div>
  )
}

export type FieldType = "text" | "number" | "select" | "boolean"

export type AdminFieldType = FieldType

export interface ListingField {
  id: string
  key: string
  label: string
  type: FieldType
  options?: string[]
  unit?: string
  placeholder?: string
  isActive?: boolean
  usedInCount?: number
}

export type AdminCategoryField = ListingField

export interface CategoryFieldAssignment {
  id: string
  categoryId: string
  fieldId: string
  required: boolean
  filterable: boolean
  active: boolean
  sortOrder: number
}

export interface AdminSubcategoryItem {
  id: string
  name: string
  slug: string
  imageUrl?: string
  listingCount: number
  isActive: boolean
  sortOrder: number
}

export interface AdminCategoryItem {
  id: string
  name: string
  slug: string
  imageUrl?: string
  description: string
  listingCount: number
  isActive: boolean
  sortOrder: number
  subcategories: AdminSubcategoryItem[]
}

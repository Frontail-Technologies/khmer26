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
  nameEn?: string
  nameKm?: string | null
  slug: string
  parentId?: string | null
  imageUrl?: string
  imageMediaId?: string | null
  description?: string
  listingCount: number
  isActive: boolean
  sortOrder: number
}

export interface AdminCategoryItem {
  id: string
  name: string
  nameEn?: string
  nameKm?: string | null
  slug: string
  parentId?: string | null
  imageUrl?: string
  imageMediaId?: string | null
  description: string
  listingCount: number
  isActive: boolean
  sortOrder: number
  subcategories: AdminSubcategoryItem[]
}

export interface CategoryItem {
  id: string
  nameEn: string
  nameKm?: string | null
  slug: string
  parentId?: string | null
  displayOrder?: number
  isActive?: boolean
  listingsCount?: number
  iconMediaId?: string | null
  imageMediaId?: string | null
}

export interface CategoryTreeNode extends CategoryItem {
  children: CategoryTreeNode[]
}

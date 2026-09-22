export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  description?: string
  children?: Category[]
  listingCount?: number
}

export interface CategoryPath {
  segments: CategoryPathSegment[]
  current: Category
}

export interface CategoryPathSegment {
  name: string
  slug: string
  href: string
}

export type PostAdStep = 1 | 2 | 3 | 4 | 5 | 6

export type CategoryFieldType = "text" | "number" | "select" | "radio"

export interface CategoryFieldDef {
  key: string
  label: string
  type: CategoryFieldType
  required?: boolean
  placeholder?: string
  options?: Array<string | { value: string; label: string }>
  unit?: string
}

export interface UploadedPhoto {
  id: string
  file?: File
  previewUrl: string
  name: string
  size: number
  isCover: boolean
  mediaId?: string
  uploadProgress?: number
  uploadStatus?: "uploading" | "done" | "error"
  uploadError?: string
}

export interface PostAdLocation {
  provinceId?: number
  districtId?: number
  communeId?: number
  province: string
  district: string
  label: string
  googleMapsUrl?: string
}

export interface ListingDraft {
  categoryId: string
  categorySlug: string
  categoryPath: string[]
  title: string
  condition: string
  description: string
  attributes: Record<string, string>
  photos: UploadedPhoto[]
  price: number | ""
  currency: string
  negotiable: boolean
  location: PostAdLocation
  contactMethod: "chat" | "phone" | "both"
  phoneNumber: string
  hidePhoneUntilClick: boolean
}

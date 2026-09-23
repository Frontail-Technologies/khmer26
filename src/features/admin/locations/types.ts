export interface CambodiaDistrict {
  id: string
  name: string
  nameKhmer?: string
  code: string
  sangkatsCount: number
  listingCount: number
  isActive: boolean
}

export interface CambodiaProvince {
  id: string
  name: string
  nameKhmer?: string
  code: string
  postalCode: string
  type: "Municipality" | "Province"
  districtsCount: number
  sangkatsCount: number
  listingCount: number
  isActive: boolean
  districts: CambodiaDistrict[]
}

export interface LocationStats {
  provincesCount: number
  districtsCount: number
  sangkatsCount: number
  activeListingsCount: number
}

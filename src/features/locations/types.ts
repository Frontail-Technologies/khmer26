export interface CambodiaCommune {
  id: string
  name: string
  nameKhmer: string
  code: string
}

export interface CambodiaDistrict {
  id: string
  name: string
  nameKhmer: string
  code: string
  sangkatsCount?: number
  communes?: CambodiaCommune[]
}

export interface CambodiaProvince {
  id: string
  name: string
  nameKhmer: string
  code: string
  postalCode: string
  type: "Municipality" | "Province"
  districts: CambodiaDistrict[]
}

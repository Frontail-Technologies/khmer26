import { describe, expect, it } from "vitest"
import { buildCreateListingInput, listingDetailToDraft } from "./post-ad.api"
import type { CategoryField } from "@/features/categories/api/categories.api"
import type { ListingDetail } from "@/features/listings/api/listing-detail.api"
import type { ListingDraft } from "../types"

const fields: CategoryField[] = [
  {
    assignmentId: "assignment-1",
    categoryId: "category-1",
    isRequired: true,
    isFilterable: true,
    displayOrder: 0,
    field: {
      id: "field-select",
      name: "brand",
      labelEn: "Brand",
      labelKm: null,
      fieldType: "select",
      options: [{ id: "option-1", fieldDefinitionId: "field-select", value: "toyota", labelEn: "Toyota", labelKm: null, displayOrder: 0 }],
    },
  },
  {
    assignmentId: "assignment-2",
    categoryId: "category-1",
    isRequired: false,
    isFilterable: true,
    displayOrder: 1,
    field: {
      id: "field-number",
      name: "year",
      labelEn: "Year",
      labelKm: null,
      fieldType: "number",
      options: [],
    },
  },
]

const draft: ListingDraft = {
  categoryId: "category-1",
  categorySlug: "cars",
  categoryPath: ["Vehicles", "Cars"],
  title: "Toyota Prius 2022",
  condition: "like_new",
  description: "Clean vehicle with complete service history.",
  attributes: { "field-select": "option-1", "field-number": "2022" },
  photos: [
    { id: "second", previewUrl: "blob:2", name: "2.jpg", size: 20, isCover: false, mediaId: "media-2", uploadStatus: "done" },
    { id: "cover", previewUrl: "blob:1", name: "1.jpg", size: 10, isCover: true, mediaId: "media-1", uploadStatus: "done" },
  ],
  price: 22000,
  currency: "USD",
  negotiable: true,
  location: {
    provinceId: 1,
    districtId: 10,
    province: "Phnom Penh",
    district: "Chamkarmon",
    label: "Chamkarmon, Phnom Penh",
    googleMapsUrl: "https://maps.app.goo.gl/example",
  },
  contactMethod: "chat",
  phoneNumber: "",
  hidePhoneUntilClick: false,
}

describe("Post Ad API payload", () => {
  it("maps IDs and dynamic field values to the backend contract", () => {
    expect(buildCreateListingInput(draft, fields)).toEqual({
      categoryId: "category-1",
      provinceId: 1,
      districtId: 10,
      communeId: undefined,
      title: "Toyota Prius 2022",
      description: "Clean vehicle with complete service history.",
      price: 22000,
      currency: "USD",
      condition: "like_new",
      negotiable: true,
      contactMethod: "chat",
      googleMapsUrl: "https://maps.app.goo.gl/example",
      mediaIds: ["media-1", "media-2"],
      fieldValues: [
        { fieldDefinitionId: "field-select", valueOptionId: "option-1" },
        { fieldDefinitionId: "field-number", valueNumber: 2022 },
      ],
    })
  })

  it("blocks submission while a photo is unfinished", () => {
    const unfinished = { ...draft, photos: [{ ...draft.photos[0]!, mediaId: undefined, uploadStatus: "uploading" as const }] }
    expect(() => buildCreateListingInput(unfinished, fields)).toThrow(/finish uploading/i)
  })

  it("hydrates exact owner values when editing an existing listing", () => {
    const listing = {
      id: "listing-1",
      title: "Existing Prius",
      description: "Original description",
      price: "21999.00",
      currency: "USD",
      condition: "good",
      negotiable: false,
      contactMethod: "both",
      category: {
        id: "category-1",
        slug: "cars",
        nameEn: "Cars",
        nameKm: null,
        breadcrumb: [{ id: "root", slug: "vehicles", nameEn: "Vehicles", nameKm: null }],
      },
      location: {
        province: { id: 1, nameEn: "Phnom Penh", nameKm: null },
        district: { id: 10, nameEn: "Chamkarmon", nameKm: null },
        commune: null,
        map: null,
        googleMapsUrl: "https://www.google.com/maps/place/Phnom+Penh",
      },
      media: [
        { id: "media-1", r2Key: "https://cdn.test/one.jpg", mimeType: "image/jpeg", displayOrder: 0 },
      ],
      editableFieldValues: [
        {
          fieldDefinitionId: "field-select",
          valueText: null,
          valueNumber: null,
          valueBoolean: null,
          valueOptionId: "option-1",
        },
        {
          fieldDefinitionId: "field-number",
          valueText: null,
          valueNumber: 2022,
          valueBoolean: null,
          valueOptionId: null,
        },
      ],
    } as ListingDetail

    expect(listingDetailToDraft(listing)).toMatchObject({
      categoryPath: ["Vehicles", "Cars"],
      attributes: { "field-select": "option-1", "field-number": "2022" },
      price: 21999,
      location: {
        provinceId: 1,
        districtId: 10,
        label: "Chamkarmon, Phnom Penh",
        googleMapsUrl: "https://www.google.com/maps/place/Phnom+Penh",
      },
      photos: [
        {
          mediaId: "media-1",
          previewUrl: "https://cdn.test/one.jpg",
          isCover: true,
          uploadStatus: "done",
        },
      ],
    })
  })
})

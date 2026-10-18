import { apiClient } from '@/lib/api/client';
import type { CategoryField } from '@/features/categories/api/categories.api';
import type { ListingDetail } from '@/features/listings/api/listing-detail.api';
import { getMediaUrl } from '@/lib/media/get-media-url';
import type { ListingDraft } from '../types';

interface ListingFieldValueInput {
  fieldDefinitionId: string;
  valueText?: string;
  valueNumber?: number;
  valueBoolean?: boolean;
  valueOptionId?: string;
}

export interface CreateListingInput {
  categoryId: string;
  provinceId: number;
  districtId?: number;
  communeId?: number;
  title: string;
  description: string;
  price: number;
  currency: 'USD' | 'KHR';
  condition: ListingDraft['condition'];
  negotiable: boolean;
  contactMethod: ListingDraft['contactMethod'];
  googleMapsUrl?: string | null;
  mediaIds: string[];
  fieldValues: ListingFieldValueInput[];
}

export interface EditableListing {
  id: string;
  isDraft: boolean;
  draft: ListingDraft;
}

function buildFieldValues(draft: ListingDraft, fields: CategoryField[]): ListingFieldValueInput[] {
  return fields.flatMap<ListingFieldValueInput>((assignment) => {
    const value = draft.attributes[assignment.field.id];
    if (value === undefined || value === '') return [];

    const base = { fieldDefinitionId: assignment.field.id };
    switch (assignment.field.fieldType) {
      case 'number':
        return [{ ...base, valueNumber: Number(value) }];
      case 'boolean':
        return [{ ...base, valueBoolean: value === 'true' }];
      case 'select':
        return [{ ...base, valueOptionId: value }];
      default:
        return [{ ...base, valueText: value }];
    }
  });
}

export function buildCreateListingInput(draft: ListingDraft, fields: CategoryField[]): CreateListingInput {
  if (!draft.location.provinceId) throw new Error('Select a province before publishing.');

  const unfinishedUpload = draft.photos.find((photo) => photo.uploadStatus !== 'done' || !photo.mediaId);
  if (unfinishedUpload) throw new Error('Wait for every photo to finish uploading before publishing.');

  const orderedPhotos = [...draft.photos].sort((a, b) => Number(b.isCover) - Number(a.isCover));
  return {
    categoryId: draft.categoryId,
    provinceId: draft.location.provinceId,
    districtId: draft.location.districtId,
    communeId: draft.location.communeId,
    title: draft.title.trim(),
    description: draft.description.trim(),
    price: Number(draft.price),
    currency: draft.currency as 'USD' | 'KHR',
    condition: draft.condition,
    negotiable: draft.negotiable,
    contactMethod: draft.contactMethod,
    googleMapsUrl: draft.location.googleMapsUrl?.trim() || null,
    mediaIds: orderedPhotos.map((photo) => photo.mediaId!),
    fieldValues: buildFieldValues(draft, fields),
  };
}

export async function createListing(input: CreateListingInput, isDraft = false) {
  const endpoint = isDraft ? '/listings/drafts' : '/listings';
  const res = await apiClient.post<{ listing: { id: string } }>(endpoint, input);
  return res.data.listing;
}

function editableValue(value: NonNullable<ListingDetail['editableFieldValues']>[number]): string {
  if (value.valueOptionId) return value.valueOptionId;
  if (value.valueText !== null) return value.valueText;
  if (value.valueNumber !== null) return String(value.valueNumber);
  if (value.valueBoolean !== null) return String(value.valueBoolean);
  return '';
}

export function listingDetailToDraft(listing: ListingDetail): ListingDraft {
  const categoryPath = listing.category.breadcrumb.map((item) => item.nameEn);
  if (categoryPath.at(-1) !== listing.category.nameEn) categoryPath.push(listing.category.nameEn);

  return {
    categoryId: listing.category.id,
    categorySlug: listing.category.slug,
    categoryPath,
    title: listing.title,
    condition: listing.condition,
    description: listing.description ?? '',
    attributes: Object.fromEntries(
      (listing.editableFieldValues ?? []).map((value) => [value.fieldDefinitionId, editableValue(value)])
    ),
    photos: listing.media.map((media, index) => ({
      id: `existing-${media.id}`,
      previewUrl: getMediaUrl(media.r2Key) ?? '',
      name: `Listing photo ${index + 1}`,
      size: 0,
      isCover: index === 0,
      mediaId: media.id,
      uploadProgress: 100,
      uploadStatus: 'done' as const,
    })),
    price: listing.price === null ? '' : Number(listing.price),
    currency: listing.currency ?? 'USD',
    negotiable: listing.negotiable,
    location: {
      provinceId: listing.location.province.id,
      districtId: listing.location.district?.id,
      communeId: listing.location.commune?.id,
      province: listing.location.province.nameEn,
      district: listing.location.district?.nameEn ?? '',
      label: [
        listing.location.commune?.nameEn,
        listing.location.district?.nameEn,
        listing.location.province.nameEn,
      ].filter(Boolean).join(', '),
      googleMapsUrl: listing.location.googleMapsUrl ?? '',
    },
    contactMethod: listing.contactMethod,
    phoneNumber: '',
    hidePhoneUntilClick: false,
  };
}

export async function getEditableListing(id: string): Promise<EditableListing> {
  const res = await apiClient.get<{ listing: ListingDetail }>(`/listings/${encodeURIComponent(id)}`);
  const listing = res.data.listing;
  if (!listing.isOwner) throw new Error('You do not have permission to edit this listing.');
  if (!listing.editableFieldValues) throw new Error('This listing cannot be edited.');
  return { id: listing.id, isDraft: listing.isDraft === true, draft: listingDetailToDraft(listing) };
}

export async function updateListing(id: string, input: CreateListingInput) {
  const res = await apiClient.patch<{ listing: { id: string } }>(
    `/listings/${encodeURIComponent(id)}`,
    input
  );
  return res.data.listing;
}

export async function submitListing(id: string) {
  const res = await apiClient.post<{ listing: { id: string } }>(
    `/listings/${encodeURIComponent(id)}/submit`
  );
  return res.data.listing;
}

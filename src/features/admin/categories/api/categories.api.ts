import { apiClient } from '@/lib/api/client';
import type {
  AdminCategoryItem,
  AdminSubcategoryItem,
  ListingField,
  FieldType,
  CategoryFieldAssignment,
} from '../types';

export interface BackendCategoryDto {
  id: string;
  parentId: string | null;
  nameEn: string;
  nameKm?: string | null;
  slug: string;
  iconMediaId?: string | null;
  imageMediaId?: string | null;
  displayOrder?: number;
  isActive: boolean;
  listingsCount?: number;
  subcategories?: BackendCategoryDto[];
}

export interface BackendCategoryFieldAssignmentDto {
  assignmentId: string;
  categoryId: string;
  isRequired: boolean;
  isFilterable: boolean;
  displayOrder: number;
  field: {
    id: string;
    name: string;
    labelEn: string;
    labelKm?: string | null;
    fieldType: 'text' | 'number' | 'select' | 'boolean';
    options: Array<{ id: string; labelEn: string; labelKm?: string | null; value: string }>;
  };
}

export function normalizeCategoryTree(rawList: BackendCategoryDto[]): AdminCategoryItem[] {
  const topLevel = rawList.filter((c) => !c.parentId);
  const byParent = new Map<string, BackendCategoryDto[]>();
  for (const c of rawList) {
    if (c.parentId) {
      const children = byParent.get(c.parentId) || [];
      children.push(c);
      byParent.set(c.parentId, children);
    }
  }

  return topLevel.map((cat) => {
    const subs = byParent.get(cat.id) || cat.subcategories || [];
    const subcategories: AdminSubcategoryItem[] = subs.map((s) => ({
      id: s.id,
      name: s.nameEn,
      nameEn: s.nameEn,
      nameKm: s.nameKm ?? null,
      slug: s.slug,
      parentId: s.parentId ?? cat.id,
      imageMediaId: s.imageMediaId ?? null,
      description: s.nameKm || '',
      listingCount: s.listingsCount || 0,
      isActive: s.isActive,
      sortOrder: s.displayOrder ?? 0,
    }));

    return {
      id: cat.id,
      name: cat.nameEn,
      nameEn: cat.nameEn,
      nameKm: cat.nameKm ?? null,
      slug: cat.slug,
      parentId: cat.parentId ?? null,
      imageMediaId: cat.imageMediaId ?? null,
      description: cat.nameKm || '',
      listingCount: cat.listingsCount || 0,
      isActive: cat.isActive,
      sortOrder: cat.displayOrder ?? 0,
      subcategories,
    };
  });
}

export async function getAdminCategories(): Promise<AdminCategoryItem[]> {
  const res = await apiClient.get<{ categories: BackendCategoryDto[] }>('/admin/categories');
  const raw = res.data?.categories || [];
  return normalizeCategoryTree(raw);
}

export async function createAdminCategory(data: {
  nameEn: string;
  nameKm?: string | null;
  slug: string;
  parentId?: string | null;
  imageMediaId?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}) {
  return apiClient.post('/admin/categories', data);
}

export async function updateAdminCategory(
  id: string,
  data: Partial<{
    nameEn: string;
    nameKm: string | null;
    slug: string;
    parentId: string | null;
    imageMediaId: string | null;
    displayOrder: number;
    isActive: boolean;
  }>
) {
  return apiClient.patch(`/admin/categories/${id}`, data);
}

export async function deleteAdminCategory(id: string) {
  return apiClient.delete(`/admin/categories/${id}`);
}

function normalizeFieldDefinition(f: {
  id: string;
  name: string;
  labelEn: string;
  fieldType: 'text' | 'number' | 'select' | 'boolean';
  isActive: boolean;
  options?: Array<{ value: string }>;
}): ListingField {
  return {
    id: f.id,
    key: f.name,
    label: f.labelEn,
    type: f.fieldType as FieldType,
    options: f.options?.map((o) => o.value) || [],
    isActive: f.isActive,
  };
}

export async function getAdminCategoryFields(
  categoryId: string
): Promise<{ assignment: CategoryFieldAssignment; field: ListingField }[]> {
  const res = await apiClient.get<{ fields: BackendCategoryFieldAssignmentDto[] }>(
    `/admin/categories/${categoryId}/fields`
  );
  const raw = res.data?.fields || [];
  return raw.map((row) => ({
    assignment: {
      id: row.assignmentId,
      categoryId: row.categoryId,
      fieldId: row.field.id,
      required: row.isRequired,
      filterable: row.isFilterable,
      active: true,
      sortOrder: row.displayOrder,
    },
    field: normalizeFieldDefinition({ ...row.field, isActive: true }),
  }));
}

export async function createAdminCategoryField(
  categoryId: string,
  data: {
    name: string;
    labelEn: string;
    labelKm?: string;
    fieldType: 'text' | 'number' | 'select' | 'boolean';
    isRequired?: boolean;
    isFilterable?: boolean;
    displayOrder?: number;
    options?: Array<{ labelEn: string; labelKm?: string; value: string }>;
  }
) {
  return apiClient.post(`/admin/categories/${categoryId}/fields`, data);
}

export async function updateAdminCategoryField(
  assignmentId: string,
  data: Partial<{
    labelEn: string;
    labelKm: string;
    isRequired: boolean;
    isFilterable: boolean;
    displayOrder: number;
    isActive: boolean;
  }>
) {
  return apiClient.patch(`/admin/category-fields/${assignmentId}`, data);
}

export async function deleteAdminCategoryField(assignmentId: string) {
  return apiClient.delete(`/admin/category-fields/${assignmentId}`);
}

export interface BackendFieldDefinitionDto {
  id: string;
  name: string;
  labelEn: string;
  labelKm?: string | null;
  fieldType: 'text' | 'number' | 'select' | 'boolean';
  isActive: boolean;
  assignedCategoryCount: number;
  options: Array<{ id: string; labelEn: string; labelKm?: string | null; value: string }>;
}

export async function getAdminFieldLibrary(): Promise<ListingField[]> {
  const res = await apiClient.get<{ fields: BackendFieldDefinitionDto[] }>('/admin/listing-fields');
  const raw = res.data?.fields || [];
  return raw.map((f) => ({ ...normalizeFieldDefinition(f), usedInCount: f.assignedCategoryCount }));
}

interface BackendFieldDefinitionRow {
  id: string;
  name: string;
  labelEn: string;
  fieldType: 'text' | 'number' | 'select' | 'boolean';
  isActive: boolean;
}

export async function createAdminFieldDefinition(data: {
  name: string;
  labelEn: string;
  labelKm?: string | null;
  fieldType: 'text' | 'number' | 'select' | 'boolean';
  isActive?: boolean;
  options?: Array<{ labelEn: string; labelKm?: string; value: string }>;
}) {
  const res = await apiClient.post<{ field: BackendFieldDefinitionRow }>('/admin/listing-fields', data);
  return normalizeFieldDefinition({
    ...res.data!.field,
    options: data.options,
  });
}

export async function updateAdminFieldDefinition(
  id: string,
  data: Partial<{ labelEn: string; labelKm: string | null; isActive: boolean }>
) {
  const res = await apiClient.patch<{ field: BackendFieldDefinitionRow }>(`/admin/listing-fields/${id}`, data);
  return normalizeFieldDefinition(res.data!.field);
}

export async function deleteAdminFieldDefinition(id: string) {
  return apiClient.delete(`/admin/listing-fields/${id}`);
}

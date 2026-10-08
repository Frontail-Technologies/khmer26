import { apiClient } from '@/lib/api/client';

export interface CategoryNode {
  id: string;
  parentId: string | null;
  nameEn: string;
  nameKm: string | null;
  slug: string;
  imageR2Key: string | null;
  displayOrder: number;
  children: CategoryNode[];
}

export type CategoryFieldType = 'text' | 'number' | 'select' | 'boolean';

export interface CategoryFieldOption {
  id: string;
  fieldDefinitionId: string;
  value: string;
  labelEn: string;
  labelKm: string | null;
  displayOrder: number;
}

export interface CategoryField {
  assignmentId: string;
  categoryId: string;
  isRequired: boolean;
  isFilterable: boolean;
  displayOrder: number;
  field: {
    id: string;
    name: string;
    labelEn: string;
    labelKm: string | null;
    fieldType: CategoryFieldType;
    options: CategoryFieldOption[];
  };
}

export async function getCategoryTree(): Promise<CategoryNode[]> {
  const res = await apiClient.get<{ categories: CategoryNode[] }>('/categories');
  return res.data.categories;
}

export async function getCategoryFields(idOrSlug: string): Promise<CategoryField[]> {
  const res = await apiClient.get<{ fields: CategoryField[] }>(
    `/categories/${encodeURIComponent(idOrSlug)}/fields`
  );
  return res.data.fields;
}

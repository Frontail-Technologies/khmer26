import { useQuery } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { getAdminCategories, getAdminCategoryFields, getAdminFieldLibrary } from '../api/categories.api';

export function useAdminCategories() {
  return useQuery({
    queryKey: adminKeys.categories.tree(),
    queryFn: getAdminCategories,
  });
}

export function useAdminCategoryFields(categoryId: string) {
  return useQuery({
    queryKey: adminKeys.categories.fields(categoryId),
    queryFn: () => getAdminCategoryFields(categoryId),
    enabled: !!categoryId,
  });
}

export function useAdminFieldLibrary() {
  return useQuery({
    queryKey: adminKeys.categories.fieldLibrary(),
    queryFn: getAdminFieldLibrary,
  });
}

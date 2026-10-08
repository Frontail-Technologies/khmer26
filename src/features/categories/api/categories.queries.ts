import { queryOptions, useQuery } from '@tanstack/react-query';
import { marketplaceKeys } from '@/lib/query/keys';
import { getCategoryFields, getCategoryTree, type CategoryField } from './categories.api';

export const categoryTreeQueryOptions = () =>
  queryOptions({
    queryKey: marketplaceKeys.categories.tree(),
    queryFn: getCategoryTree,
    staleTime: 5 * 60 * 1000,
  });

export const categoryFieldsQueryOptions = (idOrSlug: string) =>
  queryOptions({
    queryKey: marketplaceKeys.categories.fields(idOrSlug),
    queryFn: () => getCategoryFields(idOrSlug),
    staleTime: 5 * 60 * 1000,
  });

export function useCategoryTree() {
  return useQuery(categoryTreeQueryOptions());
}

/** The backend already resolves inherited fields; the UI only keeps the filterable ones. */
export function selectFilterableFields(fields: CategoryField[]): CategoryField[] {
  return fields.filter((f) => f.isFilterable);
}

export function useFilterableFields(categorySlug: string | undefined) {
  return useQuery({
    ...categoryFieldsQueryOptions(categorySlug ?? ''),
    enabled: Boolean(categorySlug),
    select: selectFilterableFields,
  });
}

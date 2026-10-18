import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import { customerKeys } from '@/lib/query/keys';
import {
  createSavedSearch,
  deleteSavedSearch,
  updateSavedSearch,
  type SavedSearch,
} from './saved-searches.api';
import type { SearchFilters } from '@/features/search/lib/search-filters';

function message(error: unknown): string {
  return error instanceof ApiError ? error.message : 'The saved search could not be updated.';
}

export function useCreateSavedSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; filters: SearchFilters; notificationsEnabled: boolean }) =>
      createSavedSearch(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: customerKeys.savedSearches.all }),
    onError: (error) => toast.error(message(error)),
  });
}

export function useUpdateSavedSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<Pick<SavedSearch, 'name' | 'filters' | 'notificationsEnabled'>> }) =>
      updateSavedSearch(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: customerKeys.savedSearches.all }),
    onError: (error) => toast.error(message(error)),
  });
}

export function useDeleteSavedSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSavedSearch,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: customerKeys.savedSearches.all }),
    onError: (error) => toast.error(message(error)),
  });
}

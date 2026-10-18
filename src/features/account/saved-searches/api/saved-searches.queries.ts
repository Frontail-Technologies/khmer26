import { useQuery } from '@tanstack/react-query';
import { customerKeys } from '@/lib/query/keys';
import { getSavedSearches } from './saved-searches.api';

export function useSavedSearches(page = 1) {
  return useQuery({
    queryKey: customerKeys.savedSearches.list({ page }),
    queryFn: () => getSavedSearches(page),
  });
}

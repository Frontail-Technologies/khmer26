import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { customerKeys } from '@/lib/query/keys';
import { getFavorites, type FavoritesInput } from './favorites.api';

export function useFavorites(input: FavoritesInput) {
  return useQuery({
    queryKey: customerKeys.favorites.list({ ...input }),
    queryFn: () => getFavorites(input),
    placeholderData: keepPreviousData,
  });
}

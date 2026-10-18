import { useQuery } from '@tanstack/react-query';
import { customerKeys } from '@/lib/query/keys';
import { getEditableListing } from './post-ad.api';

export function useEditableListing(id: string | undefined) {
  return useQuery({
    queryKey: customerKeys.myListings.edit(id ?? ''),
    queryFn: () => getEditableListing(id!),
    enabled: Boolean(id),
  });
}

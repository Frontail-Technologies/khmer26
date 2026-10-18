import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { customerKeys } from '@/lib/query/keys';

export interface PublicSettings {
  maxListingImages: number;
  listingExpiryDays: number;
  paymentsEnabled: boolean;
}

async function getPublicSettings(): Promise<PublicSettings> {
  const res = await apiClient.get<{ settings: PublicSettings }>('/public/settings');
  return res.data.settings;
}

export function usePublicSettings() {
  return useQuery({
    queryKey: customerKeys.publicSettings,
    queryFn: getPublicSettings,
    staleTime: 30 * 1000,
    refetchOnMount: "always",
  });
}

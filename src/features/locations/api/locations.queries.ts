import { useQuery } from '@tanstack/react-query';
import { marketplaceKeys } from '@/lib/query/keys';
import { getCommunes, getDistricts, getProvinces } from './locations.api';

const LOCATION_STALE_MS = 60 * 60 * 1000;

export function useProvinces() {
  return useQuery({
    queryKey: marketplaceKeys.locations.provinces(),
    queryFn: getProvinces,
    staleTime: LOCATION_STALE_MS,
  });
}

export function useDistricts(provinceId: number | undefined) {
  return useQuery({
    queryKey: marketplaceKeys.locations.districts(provinceId ?? 0),
    queryFn: () => getDistricts(provinceId!),
    enabled: provinceId !== undefined,
    staleTime: LOCATION_STALE_MS,
  });
}

export function useCommunes(districtId: number | undefined) {
  return useQuery({
    queryKey: marketplaceKeys.locations.communes(districtId ?? 0),
    queryFn: () => getCommunes(districtId!),
    enabled: districtId !== undefined,
    staleTime: LOCATION_STALE_MS,
  });
}

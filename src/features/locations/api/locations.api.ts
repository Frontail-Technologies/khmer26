import { apiClient } from '@/lib/api/client';

export interface LocationOption {
  id: number;
  nameEn: string;
  nameKm: string | null;
}

export async function getProvinces(): Promise<LocationOption[]> {
  const res = await apiClient.get<{ provinces: LocationOption[] }>('/locations/provinces');
  return res.data.provinces;
}

export async function getDistricts(provinceId: number): Promise<LocationOption[]> {
  const res = await apiClient.get<{ districts: LocationOption[] }>(
    `/locations/provinces/${provinceId}/districts`
  );
  return res.data.districts;
}

export async function getCommunes(districtId: number): Promise<LocationOption[]> {
  const res = await apiClient.get<{ communes: LocationOption[] }>(
    `/locations/districts/${districtId}/communes`
  );
  return res.data.communes;
}

import { apiClient } from '@/lib/api/client';
import type { CambodiaCommune, CambodiaProvince, CambodiaDistrict } from '../types';

export interface AdminProvinceRow {
  id: number;
  nameEn: string;
  nameKm?: string | null;
  slug: string;
  code?: string | null;
  isActive: boolean;
  sortOrder?: number;
}

export interface AdminDistrictRow {
  id: number;
  provinceId: number;
  nameEn: string;
  nameKm?: string | null;
  slug: string;
  code?: string | null;
  isActive: boolean;
  sortOrder?: number;
}

export interface AdminCommuneRow {
  id: number;
  districtId: number;
  nameEn: string;
  nameKm?: string | null;
  slug: string;
  postalCode?: string | null;
  isActive: boolean;
  sortOrder?: number;
}

export async function getAdminProvinces(): Promise<CambodiaProvince[]> {
  const [provincesRes, districtsRes, communesRes] = await Promise.all([
    apiClient.get<AdminProvinceRow[]>('/admin/locations/provinces', { params: { limit: 100 } }),
    apiClient.get<AdminDistrictRow[]>('/admin/locations/districts', { params: { limit: 500 } }),
    apiClient.get<AdminCommuneRow[]>('/admin/locations/communes', { params: { limit: 200 } }),
  ]);

  const rawProvinces = provincesRes.data || [];
  const rawDistricts = districtsRes.data || [];
  const rawCommunes = communesRes.data || [];

  const communesByDistrict = new Map<number, CambodiaCommune[]>();
  for (const c of rawCommunes) {
    const list = communesByDistrict.get(c.districtId) || [];
    list.push({
      id: String(c.id),
      name: c.nameEn,
      nameKhmer: c.nameKm || undefined,
      code: c.postalCode || String(c.id),
      postalCode: c.postalCode || undefined,
      isActive: c.isActive,
    });
    communesByDistrict.set(c.districtId, list);
  }

  const districtsByProvince = new Map<number, CambodiaDistrict[]>();
  for (const d of rawDistricts) {
    const communes = communesByDistrict.get(d.id) || [];
    const list = districtsByProvince.get(d.provinceId) || [];
    list.push({
      id: String(d.id),
      name: d.nameEn,
      nameKhmer: d.nameKm || undefined,
      code: d.code || String(d.id),
      sangkatsCount: communes.length,
      listingCount: 0,
      isActive: d.isActive,
      communes,
    });
    districtsByProvince.set(d.provinceId, list);
  }

  return rawProvinces.map((p) => {
    const districts = districtsByProvince.get(p.id) || [];
    return {
      id: String(p.id),
      name: p.nameEn,
      nameKhmer: p.nameKm || undefined,
      code: p.code || String(p.id),
      postalCode: p.code || `${p.id}000`,
      type: p.nameEn.toLowerCase().includes('phnom penh') ? 'Municipality' : 'Province',
      districtsCount: districts.length,
      sangkatsCount: districts.reduce((sum, d) => sum + d.sangkatsCount, 0),
      listingCount: 0,
      isActive: p.isActive,
      districts,
    };
  });
}

export async function createAdminProvince(data: {
  id: number;
  nameEn: string;
  nameKm: string;
  slug: string;
  isCapital?: boolean;
  isActive?: boolean;
}) {
  return apiClient.post('/admin/locations/provinces', data);
}

export async function updateAdminProvince(id: string | number, data: { nameEn?: string; nameKm?: string; slug?: string; isActive?: boolean }) {
  return apiClient.patch(`/admin/locations/provinces/${id}`, data);
}

export async function createAdminDistrict(data: {
  id: number;
  provinceId: number;
  nameEn: string;
  nameKm: string;
  slug: string;
  type: 'district' | 'municipality' | 'khan';
}) {
  return apiClient.post('/admin/locations/districts', data);
}

export async function updateAdminDistrict(id: string | number, data: { nameEn?: string; nameKm?: string; slug?: string; isActive?: boolean }) {
  return apiClient.patch(`/admin/locations/districts/${id}`, data);
}

export async function createAdminCommune(data: {
  id: number;
  districtId: number;
  nameEn: string;
  nameKm: string;
  slug: string;
  type: 'commune' | 'sangkat';
  isActive?: boolean;
}) {
  return apiClient.post('/admin/locations/communes', data);
}

export async function updateAdminCommune(id: string | number, data: { nameEn?: string; nameKm?: string; slug?: string; isActive?: boolean }) {
  return apiClient.patch(`/admin/locations/communes/${id}`, data);
}

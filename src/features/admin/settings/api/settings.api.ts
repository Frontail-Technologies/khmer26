import { apiClient } from '@/lib/api/client';
import type { PlatformSettings } from '../types';

interface BackendPlatformSettings {
  marketplaceName: string;
  supportEmail: string | null;
  supportPhone: string | null;
  primaryLanguage: 'km' | 'en';
  timezone: string;
  freeActiveListingLimit: number;
  listingExpiryDays: number;
  allowRegistrations: boolean;
}

function normalizeSettings(settings: BackendPlatformSettings): PlatformSettings {
  return {
    general: {
      marketplaceName: settings.marketplaceName,
      supportEmail: settings.supportEmail ?? '',
      supportPhone: settings.supportPhone ?? '',
      primaryLanguage: settings.primaryLanguage,
      timezone: settings.timezone,
    },
    marketplace: {
      freeListingLimit: settings.freeActiveListingLimit,
      defaultListingStatus: 'under_review',
      sellerPostingEnabled: settings.allowRegistrations,
      listingDurationDays: settings.listingExpiryDays,
    },
  };
}

function denormalizeSettings(settings: Partial<PlatformSettings>) {
  return {
    marketplaceName: settings.general?.marketplaceName,
    supportEmail: settings.general?.supportEmail,
    supportPhone: settings.general?.supportPhone,
    primaryLanguage: settings.general?.primaryLanguage,
    timezone: settings.general?.timezone,
    freeActiveListingLimit: settings.marketplace?.freeListingLimit,
    listingExpiryDays: settings.marketplace?.listingDurationDays,
    allowRegistrations: settings.marketplace?.sellerPostingEnabled,
  };
}

export async function getAdminSettings(): Promise<PlatformSettings> {
  const res = await apiClient.get<{ settings: BackendPlatformSettings }>('/admin/settings');
  return normalizeSettings(res.data.settings);
}

export async function updateAdminSettings(payload: Partial<PlatformSettings>): Promise<PlatformSettings> {
  const res = await apiClient.patch<{ settings: BackendPlatformSettings }>(
    '/admin/settings',
    denormalizeSettings(payload)
  );
  return normalizeSettings(res.data.settings);
}

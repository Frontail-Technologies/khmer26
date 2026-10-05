import { apiClient } from '@/lib/api/client';
import type { AdminAuditEntry, AuditModule } from '../types';

export function normalizeAuditLog(raw: Record<string, unknown>): AdminAuditEntry {
  const actionParts = ((raw.action as string) || '').split('.');
  const modCandidate = actionParts[0] || 'listings';
  const moduleMap: Record<string, AuditModule> = {
    listing: 'listings',
    listings: 'listings',
    verification: 'verifications',
    verifications: 'verifications',
    report: 'reports',
    reports: 'reports',
    user: 'users',
    users: 'users',
    payment: 'payments',
    payments: 'payments',
    content: 'content',
    settings: 'settings',
    role: 'roles',
    roles: 'roles',
    location: 'settings',
  };

  const auditModule: AuditModule = moduleMap[modCandidate] || 'listings';
  const actor = raw.actor as Record<string, unknown> | undefined;

  return {
    id: String(raw.id),
    timestamp: raw.createdAt ? new Date(raw.createdAt as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—',
    actorName: (actor?.fullName || actor?.username || (typeof actor?.email === 'string' ? actor.email.split('@')[0] : 'System Admin')) as string,
    actorRole: 'Admin',
    action: (raw.action as string) || 'admin.action',
    module: auditModule,
    targetName: `${(raw.targetType as string) || 'Entity'} #${(raw.targetId as string) || ''}`,
    targetId: (raw.targetId as string) || String(raw.id),
    targetType: (raw.targetType as string) || 'entity',
    details: typeof raw.details === 'string' ? raw.details : JSON.stringify(raw.details || {}),
  };
}

export async function getAdminAuditLogs(params?: {
  page?: number;
  limit?: number;
  action?: string;
  targetType?: string;
}): Promise<{ items: AdminAuditEntry[]; total: number }> {
  const res = await apiClient.get<Record<string, unknown>[]>('/admin/audit-logs', { params });
  const raw = res.data || [];
  return {
    items: raw.map(normalizeAuditLog),
    total: res.pagination?.total || raw.length,
  };
}

export type AuditModule =
  | "listings"
  | "verifications"
  | "reports"
  | "users"
  | "payments"
  | "content"
  | "settings"
  | "roles"
  | "auth"

export type AuditActionStatus = "success" | "warning" | "failure"

export interface AdminAuditEntry {
  id: string
  timestamp: string
  actorId: string
  actorName: string
  actorRole: string
  action: string
  module: AuditModule
  targetType: string
  targetId: string
  targetName: string
  status: AuditActionStatus
  ipAddress: string
  userAgent?: string
  metadata: Record<string, unknown>
}

export interface AuditLogStats {
  eventsToday: number
  adminLogins: number
  moderationActions: number
  securityAlerts: number
}

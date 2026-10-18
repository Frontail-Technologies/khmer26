export type AuditModule =
  | "listings"
  | "verifications"
  | "reports"
  | "users"
  | "payments"
  | "content"
  | "settings"
  | "roles"

export interface AdminAuditEntry {
  id: string
  displayId: string
  timestamp: string
  rawTimestamp?: string
  actorName: string
  actorRole: string
  action: string
  module: AuditModule
  targetName: string
  targetId: string
  targetDisplayId: string
  targetType: string
  details?: string
}

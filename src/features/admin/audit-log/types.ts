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
  timestamp: string
  actorName: string
  actorRole: string
  action: string
  module: AuditModule
  targetName: string
  targetId: string
  targetType: string
  details?: string
}

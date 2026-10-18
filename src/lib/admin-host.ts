export function normalizeHostname(host: string | null): string {
  if (!host) return ""

  const firstHost = host.split(",")[0]?.trim().toLowerCase() || ""
  return firstHost.split(":")[0]
}

export function getConfiguredAdminHostname(): string | null {
  const configuredUrl = process.env.NEXT_PUBLIC_ADMIN_URL
  if (!configuredUrl) return null

  try {
    return new URL(configuredUrl).hostname.toLowerCase()
  } catch {
    return null
  }
}

export function isAdminHostname(hostname: string): boolean {
  const configuredHostname = getConfiguredAdminHostname()

  return (
    hostname === configuredHostname ||
    hostname === "admin.localhost" ||
    hostname.startsWith("admin.")
  )
}

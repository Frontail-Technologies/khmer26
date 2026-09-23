import type {
  AdminStaffMember,
  PermissionGroup,
  RoleDefinition,
  RoleStats,
} from "../types"

export const DEMO_ROLE_STATS: RoleStats = {
  totalStaff: 6,
  superAdmins: 2,
  moderators: 3,
  supportAgents: 1,
}

export const DEMO_ADMIN_STAFF: AdminStaffMember[] = [
  {
    id: "STF-01",
    name: "Dara Chan",
    email: "dara.chan@khmer26.com",
    avatarUrl: "/avatars/avatar-1.png",
    role: "super_admin",
    status: "active",
    twoFactorEnabled: true,
    lastActiveAt: "Just now",
    assignedModules: ["All System Modules"],
    joinedAt: "2023-01-10",
  },
  {
    id: "STF-02",
    name: "Bona Keo",
    email: "bona.keo@khmer26.com",
    avatarUrl: "/avatars/avatar-2.png",
    role: "admin",
    status: "active",
    twoFactorEnabled: true,
    lastActiveAt: "15 mins ago",
    assignedModules: ["Listings", "Verifications", "Users", "Payments"],
    joinedAt: "2023-04-15",
  },
  {
    id: "STF-03",
    name: "Chea Rithy",
    email: "chea.rithy@khmer26.com",
    avatarUrl: "/avatars/avatar-3.png",
    role: "moderator",
    status: "active",
    twoFactorEnabled: true,
    lastActiveAt: "5 mins ago",
    assignedModules: ["Listings Moderation", "Reports", "Verifications", "Reported Chats"],
    joinedAt: "2023-08-20",
  },
  {
    id: "STF-04",
    name: "Sokun Vuth",
    email: "sokun.vuth@khmer26.com",
    avatarUrl: "/avatars/avatar-4.png",
    role: "moderator",
    status: "active",
    twoFactorEnabled: true,
    lastActiveAt: "2 hours ago",
    assignedModules: ["Listings Moderation", "Reviews"],
    joinedAt: "2024-01-12",
  },
  {
    id: "STF-05",
    name: "Srey Roth",
    email: "srey.roth@khmer26.com",
    avatarUrl: "/avatars/avatar-5.png",
    role: "support",
    status: "active",
    twoFactorEnabled: false,
    lastActiveAt: "Yesterday",
    assignedModules: ["Help Desk", "User Inquiries", "Report Intake"],
    joinedAt: "2024-05-01",
  },
  {
    id: "STF-06",
    name: "Chanthy Heng",
    email: "chanthy.heng@khmer26.com",
    avatarUrl: "/avatars/avatar-6.png",
    role: "super_admin",
    status: "active",
    twoFactorEnabled: true,
    lastActiveAt: "3 days ago",
    assignedModules: ["All System Modules"],
    joinedAt: "2023-01-10",
  },
]

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "grp-marketplace",
    name: "Marketplace Operations",
    description: "Approve, reject, edit, and moderate live classified ads, verification queues, and dispute reports.",
    permissions: [
      { key: "listings.manage", name: "Manage Listings", description: "Review and moderate seller ads." },
      { key: "reports.manage", name: "Manage Reports", description: "Investigate and resolve buyer complaints." },
      { key: "verifications.manage", name: "Manage Verifications", description: "Review ID and business patents." },
    ],
  },
  {
    id: "grp-users",
    name: "Users & Accounts",
    description: "Inspect customer profiles, restrict accounts, and handle seller credentials.",
    permissions: [
      { key: "users.manage", name: "Manage Users & Sellers", description: "Suspend, restrict, and manage account statuses." },
    ],
  },
  {
    id: "grp-monetization",
    name: "Monetization & Billing",
    description: "View financial ledger, track KHQR payment receipts, and manage dealer subscription plans.",
    permissions: [
      { key: "payments.view", name: "View Payments & Financials", description: "Access transaction ledger and audit receipts." },
      { key: "subscriptions.manage", name: "Manage Subscriptions", description: "Configure dealer tiers and renewal rules." },
    ],
  },
  {
    id: "grp-content",
    name: "Content Management",
    description: "Curate homepage banners, featured spotlight ads, and publish legal terms.",
    permissions: [
      { key: "content.manage", name: "Manage Content & Banners", description: "Publish marketing sliders and static pages." },
    ],
  },
  {
    id: "grp-system",
    name: "System & Governance",
    description: "Configure system-wide settings, localize Cambodia taxonomy, and manage staff roles.",
    permissions: [
      { key: "settings.manage", name: "Manage Platform Settings", description: "Update global marketplace policies." },
      { key: "roles.manage", name: "Manage Staff Roles & RBAC", description: "Assign staff permissions and administrative credentials." },
    ],
  },
]

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    id: "super_admin",
    name: "Super Administrator",
    description: "Unrestricted master access to all marketplace, financial, security, and administrative systems.",
    assignedStaffCount: 2,
    grantedPermissions: [
      "listings.manage",
      "reports.manage",
      "verifications.manage",
      "users.manage",
      "payments.view",
      "subscriptions.manage",
      "content.manage",
      "settings.manage",
      "roles.manage",
    ],
  },
  {
    id: "admin",
    name: "Operations Administrator",
    description: "Broad operational authority across listings, verifications, user profiles, and monetization telemetry.",
    assignedStaffCount: 1,
    grantedPermissions: [
      "listings.manage",
      "reports.manage",
      "verifications.manage",
      "users.manage",
      "payments.view",
      "subscriptions.manage",
      "content.manage",
    ],
  },
  {
    id: "moderator",
    name: "Trust & Safety Moderator",
    description: "Focused queue execution for listing inspection, verification validation, and community dispute handling.",
    assignedStaffCount: 2,
    grantedPermissions: [
      "listings.manage",
      "reports.manage",
      "verifications.manage",
    ],
  },
  {
    id: "support",
    name: "Customer Support Specialist",
    description: "Read-only and report intake assistance to support buyer and seller marketplace inquiries.",
    assignedStaffCount: 1,
    grantedPermissions: [
      "reports.manage",
    ],
  },
]

export const adminKeys = {
  all: ['admin'] as const,

  auth: () => [...adminKeys.all, 'auth'] as const,

  dashboard: {
    all: ['admin', 'dashboard'] as const,
    overview: () => [...adminKeys.all, 'dashboard'] as const,
  },

  listings: Object.assign(
    (params?: Record<string, unknown>) =>
      [...adminKeys.all, 'listings', params ? { ...params } : {}] as const,
    {
      all: ['admin', 'listings'] as const,
      list: (params?: Record<string, unknown>) =>
        [...adminKeys.all, 'listings', params ? { ...params } : {}] as const,
      detail: (id: string) => [...adminKeys.all, 'listings', id] as const,
    }
  ),
  listing: (id: string) => [...adminKeys.all, 'listings', id] as const,

  moderationQueue: (params?: Record<string, unknown>) =>
    [...adminKeys.all, 'moderation-queue', params ? { ...params } : {}] as const,

  users: Object.assign(
    (params?: Record<string, unknown>) =>
      [...adminKeys.all, 'users', params ? { ...params } : {}] as const,
    {
      all: ['admin', 'users'] as const,
      list: (params?: Record<string, unknown>) =>
        [...adminKeys.all, 'users', params ? { ...params } : {}] as const,
      detail: (id: string) => [...adminKeys.all, 'users', id] as const,
    }
  ),
  user: (id: string) => [...adminKeys.all, 'users', id] as const,

  sellers: Object.assign(
    (params?: Record<string, unknown>) =>
      [...adminKeys.all, 'sellers', params ? { ...params } : {}] as const,
    {
      all: ['admin', 'sellers'] as const,
      list: (params?: Record<string, unknown>) =>
        [...adminKeys.all, 'sellers', params ? { ...params } : {}] as const,
      detail: (id: string) => [...adminKeys.all, 'sellers', id] as const,
    }
  ),
  seller: (id: string) => [...adminKeys.all, 'sellers', id] as const,

  categories: Object.assign(
    () => [...adminKeys.all, 'categories'] as const,
    {
      all: ['admin', 'categories'] as const,
      tree: () => [...adminKeys.all, 'categories'] as const,
      fields: (categoryId: string) =>
        [...adminKeys.all, 'category-fields', categoryId] as const,
      fieldLibrary: () => [...adminKeys.all, 'field-library'] as const,
    }
  ),
  categoryFields: (categoryId: string) =>
    [...adminKeys.all, 'category-fields', categoryId] as const,

  verifications: Object.assign(
    (params?: Record<string, unknown>) =>
      [...adminKeys.all, 'verifications', params ? { ...params } : {}] as const,
    {
      all: ['admin', 'verifications'] as const,
      list: (params?: Record<string, unknown>) =>
        [...adminKeys.all, 'verifications', params ? { ...params } : {}] as const,
      detail: (id: string) => [...adminKeys.all, 'verifications', id] as const,
    }
  ),
  verification: (id: string) => [...adminKeys.all, 'verifications', id] as const,

  subscriptions: {
    all: ['admin', 'subscriptions'] as const,
    list: () => [...adminKeys.all, 'subscriptions', 'list'] as const,
    plans: () => [...adminKeys.all, 'subscriptions', 'plans'] as const,
  },
  subscriptionPlans: () => [...adminKeys.all, 'subscriptions', 'plans'] as const,

  reports: Object.assign(
    (params?: Record<string, unknown>) =>
      [...adminKeys.all, 'reports', params ? { ...params } : {}] as const,
    {
      all: ['admin', 'reports'] as const,
      list: (params?: Record<string, unknown>) =>
        [...adminKeys.all, 'reports', params ? { ...params } : {}] as const,
      detail: (id: string) => [...adminKeys.all, 'reports', id] as const,
      reasons: () => [...adminKeys.all, 'reports', 'reasons'] as const,
    }
  ),
  report: (id: string) => [...adminKeys.all, 'reports', id] as const,

  reportedChats: (params?: Record<string, unknown>) =>
    [...adminKeys.all, 'chat-reports', params ? { ...params } : {}] as const,
  chatReportContext: (id: string) =>
    [...adminKeys.all, 'chat-report-context', id] as const,

  chatConversations: (userId: string, params?: Record<string, unknown>) =>
    [...adminKeys.all, 'chat-conversations', userId, params ? { ...params } : {}] as const,
  chatConversationMessages: (conversationId: string, params?: Record<string, unknown>) =>
    [...adminKeys.all, 'chat-conversation-messages', conversationId, params ? { ...params } : {}] as const,

  auditLogs: Object.assign(
    (params?: Record<string, unknown>) =>
      [...adminKeys.all, 'audit-logs', params ? { ...params } : {}] as const,
    {
      all: ['admin', 'audit-logs'] as const,
      list: (params?: Record<string, unknown>) =>
        [...adminKeys.all, 'audit-logs', params ? { ...params } : {}] as const,
    }
  ),

  settings: () => [...adminKeys.all, 'settings'] as const,

  // --- Locations ---
  locations: {
    all: ['admin', 'locations'] as const,
    provinces: (params?: Record<string, unknown>) =>
      [...adminKeys.all, 'locations', 'provinces', params ? { ...params } : {}] as const,
    districts: (params?: Record<string, unknown>) =>
      [...adminKeys.all, 'locations', 'districts', params ? { ...params } : {}] as const,
    communes: (params?: Record<string, unknown>) =>
      [...adminKeys.all, 'locations', 'communes', params ? { ...params } : {}] as const,
  },
  provinces: (params?: Record<string, unknown>) =>
    [...adminKeys.all, 'locations', 'provinces', params ? { ...params } : {}] as const,
  districts: (params?: Record<string, unknown>) =>
    [...adminKeys.all, 'locations', 'districts', params ? { ...params } : {}] as const,
  communes: (params?: Record<string, unknown>) =>
    [...adminKeys.all, 'locations', 'communes', params ? { ...params } : {}] as const,

  // --- Promotion packages ---
  promotions: {
    all: ['admin', 'promotions'] as const,
    packages: (params?: Record<string, unknown>) =>
      [...adminKeys.all, 'promotions', 'packages', params ? { ...params } : {}] as const,
    package: (id: string) => [...adminKeys.all, 'promotions', 'package', id] as const,
    active: (params?: Record<string, unknown>) =>
      [...adminKeys.all, 'promotions', 'active', params ? { ...params } : {}] as const,
  },
  promotionPackages: (params?: Record<string, unknown>) =>
    [...adminKeys.all, 'promotions', 'packages', params ? { ...params } : {}] as const,
  promotionPackage: (id: string) => [...adminKeys.all, 'promotions', 'package', id] as const,

  // --- Payments ---
  payments: Object.assign(
    (params?: Record<string, unknown>) =>
      [...adminKeys.all, 'payments', params ? { ...params } : {}] as const,
    {
      all: ['admin', 'payments'] as const,
      list: (params?: Record<string, unknown>) =>
        [...adminKeys.all, 'payments', params ? { ...params } : {}] as const,
      detail: (id: string) => [...adminKeys.all, 'payments', id] as const,
    }
  ),
  payment: (id: string) => [...adminKeys.all, 'payments', id] as const,

  // --- Broadcasts ---
  notifications: {
    all: ['admin', 'notifications'] as const,
    broadcasts: (params?: Record<string, unknown>) =>
      [...adminKeys.all, 'notifications', 'broadcasts', params ? { ...params } : {}] as const,
    broadcast: (id: string) => [...adminKeys.all, 'notifications', 'broadcasts', id] as const,
  },
  broadcasts: (params?: Record<string, unknown>) =>
    [...adminKeys.all, 'notifications', 'broadcasts', params ? { ...params } : {}] as const,
  broadcast: (id: string) => [...adminKeys.all, 'notifications', 'broadcasts', id] as const,

  // --- Roles / RBAC ---
  roles: Object.assign(
    () => [...adminKeys.all, 'roles'] as const,
    {
      all: ['admin', 'roles'] as const,
      list: () => [...adminKeys.all, 'roles'] as const,
      detail: (id: string) => [...adminKeys.all, 'roles', id] as const,
      permissions: () => [...adminKeys.all, 'roles', 'permissions'] as const,
      staff: () => [...adminKeys.all, 'roles', 'staff'] as const,
    }
  ),
  role: (id: string) => [...adminKeys.all, 'roles', id] as const,
  permissions: () => [...adminKeys.all, 'roles', 'permissions'] as const,
  staff: () => [...adminKeys.all, 'roles', 'staff'] as const,

  // --- Reviews ---
  reviews: Object.assign(
    (params?: Record<string, unknown>) =>
      [...adminKeys.all, 'reviews', params ? { ...params } : {}] as const,
    {
      all: ['admin', 'reviews'] as const,
      list: (params?: Record<string, unknown>) =>
        [...adminKeys.all, 'reviews', params ? { ...params } : {}] as const,
      detail: (id: string) => [...adminKeys.all, 'reviews', id] as const,
      reports: (params?: Record<string, unknown>) =>
        [...adminKeys.all, 'reviews', 'reports', params ? { ...params } : {}] as const,
    }
  ),
  review: (id: string) => [...adminKeys.all, 'reviews', id] as const,
  reviewReports: (params?: Record<string, unknown>) =>
    [...adminKeys.all, 'reviews', 'reports', params ? { ...params } : {}] as const,

  // --- CMS / Content ---
  content: {
    all: ['admin', 'content'] as const,
    homeConfig: () => [...adminKeys.all, 'content', 'home'] as const,
    homePopularCategories: () => [...adminKeys.all, 'content', 'home-popular-categories'] as const,
    banners: () => [...adminKeys.all, 'banners'] as const,
    featuredSections: () => [...adminKeys.all, 'featured-sections'] as const,
    safetyTips: () => [...adminKeys.all, 'safety-tips'] as const,
    staticPages: () => [...adminKeys.all, 'static-pages'] as const,
    staticPage: (slug: string) => [...adminKeys.all, 'static-pages', slug] as const,
  },
  contentHome: () => [...adminKeys.all, 'content', 'home'] as const,
  banners: () => [...adminKeys.all, 'banners'] as const,
  featuredSections: () => [...adminKeys.all, 'featured-sections'] as const,
  safetyTips: () => [...adminKeys.all, 'safety-tips'] as const,
  staticPages: () => [...adminKeys.all, 'static-pages'] as const,
  staticPage: (slug: string) => [...adminKeys.all, 'static-pages', slug] as const,
};

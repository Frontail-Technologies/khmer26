export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

export const marketplaceKeys = {
  all: ['marketplace'] as const,
  home: () => [...marketplaceKeys.all, 'home'] as const,

  content: {
    all: ['marketplace', 'content'] as const,
    safetyTips: (context: string) => ['marketplace', 'content', 'safety-tips', context] as const,
    moderationKeywords: () => ['marketplace', 'content', 'moderation-keywords'] as const,
  },

  categories: {
    all: ['marketplace', 'categories'] as const,
    tree: () => [...marketplaceKeys.categories.all, 'tree'] as const,
    detail: (idOrSlug: string) => [...marketplaceKeys.categories.all, 'detail', idOrSlug] as const,
    fields: (idOrSlug: string) => [...marketplaceKeys.categories.all, 'fields', idOrSlug] as const,
  },

  search: {
    all: ['marketplace', 'search'] as const,
    results: (params: Record<string, unknown>) =>
      [...marketplaceKeys.search.all, 'results', params] as const,
    suggestions: (params: { q: string; category?: string; kind?: 'sellers' }) =>
      [...marketplaceKeys.search.all, 'suggestions', params] as const,
  },

  listings: {
    all: ['marketplace', 'listings'] as const,
    detail: (id: string) => [...marketplaceKeys.listings.all, 'detail', id] as const,
    similar: (id: string) => [...marketplaceKeys.listings.all, 'similar', id] as const,
    contacts: (id: string) => [...marketplaceKeys.listings.all, 'contacts', id] as const,
    bySeller: (sellerId: string) => [...marketplaceKeys.listings.all, 'seller', sellerId] as const,
  },

  sellers: {
    all: ['marketplace', 'sellers'] as const,
    detail: (id: string) => [...marketplaceKeys.sellers.all, 'detail', id] as const,
    listings: (id: string, params?: Record<string, unknown>) =>
      [...marketplaceKeys.sellers.all, 'listings', id, params ?? {}] as const,
    reviews: (id: string, params?: Record<string, unknown>) =>
      [...marketplaceKeys.sellers.all, 'reviews', id, params ?? {}] as const,
    reviewEligibility: (id: string) =>
      [...marketplaceKeys.sellers.all, 'review-eligibility', id] as const,
    categories: (id: string) => [...marketplaceKeys.sellers.all, 'categories', id] as const,
    contacts: (id: string) => [...marketplaceKeys.sellers.all, 'contacts', id] as const,
  },

  reports: {
    reasons: (targetType: string) =>
      ['marketplace', 'reports', 'reasons', targetType] as const,
  },

  locations: {
    all: ['marketplace', 'locations'] as const,
    provinces: () => [...marketplaceKeys.locations.all, 'provinces'] as const,
    districts: (provinceId: number) =>
      [...marketplaceKeys.locations.all, 'districts', provinceId] as const,
    communes: (districtId: number) =>
      [...marketplaceKeys.locations.all, 'communes', districtId] as const,
  },
};

/**
 * Signed-in customer areas. Everything is hierarchical so a feature can invalidate precisely
 * (e.g. `customerKeys.myListings.all` after any listing change, `.list(params)` for one tab).
 */
export const customerKeys = {
  profile: ['customer', 'profile'] as const,

  myListings: {
    all: ['customer', 'listings'] as const,
    list: (params: Record<string, unknown>) => [...customerKeys.myListings.all, 'list', params] as const,
    draft: (id: string) => [...customerKeys.myListings.all, 'draft', id] as const,
    edit: (id: string) => [...customerKeys.myListings.all, 'edit', id] as const,
  },

  promotions: {
    all: ['customer', 'promotions'] as const,
    packages: () => [...customerKeys.promotions.all, 'packages'] as const,
  },

  favorites: {
    all: ['customer', 'favorites'] as const,
    list: (params: Record<string, unknown>) => [...customerKeys.favorites.all, 'list', params] as const,
  },

  savedSearches: {
    all: ['customer', 'saved-searches'] as const,
    list: (params: Record<string, unknown>) =>
      [...customerKeys.savedSearches.all, 'list', params] as const,
  },

  conversations: {
    all: ['customer', 'conversations'] as const,
    list: (params: Record<string, unknown>) => [...customerKeys.conversations.all, 'list', params] as const,
    detail: (id: string) => [...customerKeys.conversations.all, 'detail', id] as const,
    unread: () => [...customerKeys.conversations.all, 'unread'] as const,
  },

  messages: {
    all: ['customer', 'messages'] as const,
    thread: (conversationId: string) => [...customerKeys.messages.all, conversationId] as const,
  },

  notifications: {
    all: ['customer', 'notifications'] as const,
    list: (params: Record<string, unknown>) => [...customerKeys.notifications.all, 'list', params] as const,
    unread: () => [...customerKeys.notifications.all, 'unread'] as const,
    preferences: () => [...customerKeys.notifications.all, 'preferences'] as const,
  },

  subscription: {
    all: ['customer', 'subscription'] as const,
    plans: () => ['marketplace', 'plans'] as const,
    current: () => [...customerKeys.subscription.all, 'current'] as const,
    usage: () => [...customerKeys.subscription.all, 'usage'] as const,
    orders: (params: Record<string, unknown>) => [...customerKeys.subscription.all, 'orders', params] as const,
    history: () => [...customerKeys.subscription.all, 'history'] as const,
  },

  payments: {
    all: ['customer', 'payments'] as const,
    list: (params: Record<string, unknown>) => [...customerKeys.payments.all, 'list', params] as const,
    detail: (id: string) => [...customerKeys.payments.all, 'detail', id] as const,
  },

  verification: ['customer', 'verification'] as const,
  blockedUsers: ['customer', 'blocked-users'] as const,
  privacy: ['customer', 'privacy'] as const,
  sessions: ['customer', 'sessions'] as const,
  publicSettings: ['marketplace', 'settings'] as const,
};

export const adminKeys = {
  all: ['admin'] as const,

  support: {
    all: ['admin', 'support'] as const,
    list: (params?: Record<string, unknown>) => ['admin', 'support', params ? { ...params } : {}] as const,
  },

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
    pages: () => [...adminKeys.all, 'content', 'pages'] as const,
    moderationKeywords: () => [...adminKeys.all, 'content', 'moderation-keywords'] as const,
  },
};

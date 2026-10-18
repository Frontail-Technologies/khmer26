export interface PageInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface Page<T> {
  items: T[]
  pagination: PageInfo
}

export interface PageParams {
  page: number
  limit: number
}

/**
 * Turns a list response (`data` = items, pagination under `meta` or `pagination`) into a Page.
 * If the backend sent no pagination, the page is treated as complete.
 */
export function toPage<T>(
  res: { data: T[]; meta?: Partial<PageInfo> & Record<string, unknown>; pagination?: PageInfo },
  params: PageParams
): Page<T> {
  const fromMeta =
    res.meta &&
    typeof res.meta.total === "number" &&
    typeof res.meta.totalPages === "number"
      ? ({
          page: res.meta.page ?? params.page,
          limit: res.meta.limit ?? params.limit,
          total: res.meta.total,
          totalPages: res.meta.totalPages,
        } satisfies PageInfo)
      : undefined

  return {
    items: res.data,
    pagination: fromMeta ?? res.pagination ?? { ...params, total: res.data.length, totalPages: 1 },
  }
}

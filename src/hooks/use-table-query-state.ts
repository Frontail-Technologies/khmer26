'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

export interface TableQueryStateOptions {
  defaultPage?: number;
  defaultLimit?: number;
  defaultSort?: string;
  defaultOrder?: 'asc' | 'desc';
}

export function useTableQueryState(options: TableQueryStateOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const defaultPage = options.defaultPage ?? 1;
  const defaultLimit = options.defaultLimit ?? 20;

  const page = Number(searchParams.get('page')) || defaultPage;
  const limit = Number(searchParams.get('limit')) || defaultLimit;
  const search = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || options.defaultSort || '';
  const order = (searchParams.get('order') as 'asc' | 'desc') || options.defaultOrder || 'desc';

  const updateUrl = useCallback(
    (params: URLSearchParams) => {
      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      startTransition(() => {
        router.push(targetUrl, { scroll: false });
      });
    },
    [pathname, router]
  );

  const setPage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newPage <= defaultPage) {
        params.delete('page');
      } else {
        params.set('page', String(newPage));
      }
      updateUrl(params);
    },
    [searchParams, defaultPage, updateUrl]
  );

  const setLimit = useCallback(
    (newLimit: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newLimit === defaultLimit) {
        params.delete('limit');
      } else {
        params.set('limit', String(newLimit));
      }
      params.delete('page');
      updateUrl(params);
    },
    [searchParams, defaultLimit, updateUrl]
  );

  const setSearch = useCallback(
    (newSearch: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!newSearch.trim()) {
        params.delete('q');
      } else {
        params.set('q', newSearch.trim());
      }
      params.delete('page');
      updateUrl(params);
    },
    [searchParams, updateUrl]
  );

  const setFilter = useCallback(
    (key: string, value: string | number | boolean | undefined | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === undefined || value === null || value === '' || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
      params.delete('page');
      updateUrl(params);
    },
    [searchParams, updateUrl]
  );

  const setFilters = useCallback(
    (filters: Record<string, string | number | boolean | undefined | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(filters)) {
        if (value === undefined || value === null || value === '' || value === 'all') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }
      params.delete('page');
      updateUrl(params);
    },
    [searchParams, updateUrl]
  );

  const setSort = useCallback(
    (newSort: string, newOrder?: 'asc' | 'desc') => {
      const params = new URLSearchParams(searchParams.toString());
      if (!newSort) {
        params.delete('sort');
        params.delete('order');
      } else {
        params.set('sort', newSort);
        if (newOrder) {
          params.set('order', newOrder);
        } else if (params.get('sort') === newSort && params.get('order') === 'asc') {
          params.set('order', 'desc');
        } else {
          params.set('order', 'asc');
        }
      }
      params.delete('page');
      updateUrl(params);
    },
    [searchParams, updateUrl]
  );

  const clearFilters = useCallback(
    (preserveKeys: string[] = []) => {
      const params = new URLSearchParams();
      for (const key of preserveKeys) {
        const val = searchParams.get(key);
        if (val) params.set(key, val);
      }
      updateUrl(params);
    },
    [searchParams, updateUrl]
  );

  const getFilter = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  return {
    page,
    limit,
    search,
    sort,
    order,
    setPage,
    setLimit,
    setSearch,
    setFilter,
    setFilters,
    setSort,
    clearFilters,
    getFilter,
    rawParams: searchParams,
  };
}

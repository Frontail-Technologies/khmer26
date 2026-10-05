import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTableQueryState } from './use-table-query-state';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => '/admin/listings',
  useSearchParams: () => new URLSearchParams('page=3&q=old'),
}));

describe('useTableQueryState', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it('removes the page param when searching', () => {
    const { result } = renderHook(() => useTableQueryState({ defaultLimit: 20 }));

    act(() => {
      result.current.setSearch('laptops');
    });

    const [targetUrl] = pushMock.mock.calls[0];
    const params = new URLSearchParams(targetUrl.split('?')[1]);
    expect(params.has('page')).toBe(false);
    expect(params.get('q')).toBe('laptops');
  });

  it('removes the page param when changing a filter', () => {
    const { result } = renderHook(() => useTableQueryState({ defaultLimit: 20 }));

    act(() => {
      result.current.setFilter('status', 'active');
    });

    const [targetUrl] = pushMock.mock.calls[0];
    const params = new URLSearchParams(targetUrl.split('?')[1]);
    expect(params.has('page')).toBe(false);
    expect(params.get('status')).toBe('active');
  });

  it('drops a filter entirely when set to "all"', () => {
    const { result } = renderHook(() => useTableQueryState({ defaultLimit: 20 }));

    act(() => {
      result.current.setFilter('status', 'all');
    });

    const [targetUrl] = pushMock.mock.calls[0];
    expect(targetUrl).not.toContain('status=');
  });
});

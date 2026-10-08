'use client';

import { useRouter } from 'next/navigation';
import { useCurrentUser } from './use-current-user';

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useCurrentUser();
  const router = useRouter();

  return function requireAuth<T>(action: () => T): T | undefined {
    if (isLoading) return undefined;
    if (!isAuthenticated) {
      const returnTo = typeof window !== 'undefined' ? window.location.pathname : '/';
      const safeReturn = returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/';
      router.push(`/login?next=${encodeURIComponent(safeReturn)}`);
      return undefined;
    }
    return action();
  };
}

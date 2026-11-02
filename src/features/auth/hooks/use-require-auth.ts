'use client';

import { useCurrentUser } from './use-current-user';
import { openSignInPrompt } from '../lib/sign-in-prompt-store';

/**
 * Runs `action` for signed-in visitors. Guests get the "Sign in to continue" prompt in place
 * (returning them to this page after sign-in) instead of being bounced to /login.
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useCurrentUser();

  return function requireAuth<T>(action: () => T): T | undefined {
    if (isLoading) return undefined;
    if (!isAuthenticated) {
      openSignInPrompt();
      return undefined;
    }
    return action();
  };
}

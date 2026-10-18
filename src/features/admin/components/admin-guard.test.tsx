import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { AdminGuard } from './admin-guard';

const replaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

vi.mock('@/hooks/use-admin-auth', () => ({
  useAdminAuth: () => ({
    isLoading: false,
    isAuthenticated: false,
    isAdmin: false,
  }),
}));

describe('AdminGuard', () => {
  it('redirects unauthenticated users to /admin/login, not /admin-login', () => {
    render(
      <AdminGuard>
        <div>secret admin content</div>
      </AdminGuard>
    );

    expect(replaceMock).toHaveBeenCalledWith('/admin/login');
  });
});

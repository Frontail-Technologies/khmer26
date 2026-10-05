import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { AdminGuard } from './admin-guard';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
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

    expect(pushMock).toHaveBeenCalledWith('/admin/login');
  });
});

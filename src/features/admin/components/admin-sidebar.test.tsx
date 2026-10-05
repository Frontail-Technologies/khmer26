import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from './admin-sidebar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/admin/listings',
  useSearchParams: () => new URLSearchParams(),
}));

describe('<AdminSidebar />', () => {
  it('renders admin branding and core navigation links', () => {
    renderWithProviders(
      <SidebarProvider>
        <AdminSidebar />
      </SidebarProvider>
    );

    expect(screen.getByLabelText(/khmer26 admin dashboard/i)).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Listings')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Verifications')).toBeInTheDocument();
    expect(screen.getByText('Payments')).toBeInTheDocument();
    expect(screen.getByText('Promotions')).toBeInTheDocument();
    expect(screen.getByText('View Marketplace')).toBeInTheDocument();
  });
});

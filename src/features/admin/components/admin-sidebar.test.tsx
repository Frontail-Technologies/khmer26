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

  it('hides labels and uses compact branding when collapsed', () => {
    const { container } = renderWithProviders(
      <SidebarProvider defaultOpen={false}>
        <AdminSidebar />
      </SidebarProvider>
    );

    expect(screen.getByText('K26')).toHaveClass(
      'group-data-[collapsible=icon]:inline-flex'
    );
    expect(screen.getByText('Listings')).toHaveClass(
      'group-data-[collapsible=icon]:hidden'
    );
    expect(screen.getByText('Reports')).toHaveClass(
      'group-data-[collapsible=icon]:hidden'
    );
    expect(screen.getByText('Content Management')).toHaveClass(
      'group-data-[collapsible=icon]:hidden'
    );
    expect(screen.getByText('View Marketplace')).toHaveClass(
      'group-data-[collapsible=icon]:hidden'
    );

    const sidebarMenus = container.querySelectorAll('[data-sidebar="menu"]');
    expect(sidebarMenus.length).toBeGreaterThan(0);
    sidebarMenus.forEach((menu) => {
      expect(menu).toHaveClass('group-data-[collapsible=icon]:items-center');
    });

    expect(screen.getByText('Listings').closest('a')).toHaveAttribute(
      'href',
      '/admin/listings'
    );
    expect(screen.getByText('Reports').closest('a')).toHaveAttribute(
      'href',
      '/admin/reports'
    );
    expect(screen.getByText('Content Management').closest('a')).toHaveAttribute(
      'href',
      '/admin/content/homepage'
    );
  });
});

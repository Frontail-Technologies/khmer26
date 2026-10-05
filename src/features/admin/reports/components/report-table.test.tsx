import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { ReportTable } from './report-table';
import type { AdminReport } from '../types';

const mockReports: AdminReport[] = [
  {
    id: 'rep-1',
    reporter: { name: 'Srey Mao', accountType: 'user' },
    targetType: 'listing',
    target: {
      type: 'listing',
      id: 'l-1',
      title: 'Suspicious iPhone 14 Pro Max',
      sellerName: 'Shop A',
      href: '/admin/listings/l-1',
    },
    reason: 'spam',
    reasonLabel: 'Spam / Counterfeit Item',
    statement: 'Item seems counterfeit.',
    status: 'open',
    createdAt: '2026-01-01',
    createdDate: '2026-01-01',
    timestamp: 1767225600000,
  },
  {
    id: 'rep-2',
    reporter: { name: 'Bun Thoeun', accountType: 'user' },
    targetType: 'user',
    target: {
      type: 'user',
      id: 'u-9',
      title: 'Suspicious Seller Profile',
      sellerName: 'Bad Actor',
      href: '/admin/users/u-9',
    },
    reason: 'fraud',
    reasonLabel: 'Suspected Fraudulent Activity',
    statement: 'Asked for money transfer upfront.',
    status: 'resolved',
    createdAt: '2026-01-02',
    createdDate: '2026-01-02',
    timestamp: 1767312000000,
    resolvedAt: '2026-01-03',
  },
];

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('../hooks/reports.queries', () => ({
  useAdminReports: () => ({
    data: { items: mockReports },
    isLoading: false,
  }),
}));

describe('<ReportTable />', () => {
  it('renders report items and filters by open and resolved status tabs', () => {
    renderWithProviders(<ReportTable initialData={mockReports} />);

    expect(screen.getAllByText('Suspicious iPhone 14 Pro Max')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Suspicious Seller Profile')[0]).toBeInTheDocument();

    const openTab = screen.getByRole('button', { name: /open/i });
    fireEvent.click(openTab);

    expect(screen.getAllByText('Suspicious iPhone 14 Pro Max')[0]).toBeInTheDocument();
    expect(screen.queryAllByText('Suspicious Seller Profile')).toHaveLength(0);

    const resolvedTab = screen.getByRole('button', { name: /resolved/i });
    fireEvent.click(resolvedTab);

    expect(screen.getAllByText('Suspicious Seller Profile')[0]).toBeInTheDocument();
    expect(screen.queryAllByText('Suspicious iPhone 14 Pro Max')).toHaveLength(0);
  });
});

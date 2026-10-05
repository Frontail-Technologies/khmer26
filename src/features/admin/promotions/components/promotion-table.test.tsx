import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { PromotionTable } from './promotion-table';
import type { ActivePromotionItem } from '../types';

const mockPromotions: ActivePromotionItem[] = [
  {
    id: 'promo-1',
    listingId: 'listing-1',
    listingTitle: 'Toyota Prius 2015 Silver',
    listingPrice: 12500,
    currency: 'USD',
    sellerId: 'user-1',
    sellerName: 'Sokha Motors',
    promotionType: 'featured',
    durationDays: 14,
    startedAt: '2026-01-01',
    expiresAt: '2026-01-15',
    status: 'active',
    amountPaid: 15,
  },
  {
    id: 'promo-2',
    listingId: 'listing-2',
    listingTitle: 'Modern Villa Sen Sok',
    listingPrice: 180000,
    currency: 'USD',
    sellerId: 'user-2',
    sellerName: 'Cambodia Real Estate',
    promotionType: 'urgent',
    durationDays: 7,
    startedAt: '2026-01-05',
    expiresAt: '2026-01-12',
    status: 'expired',
    amountPaid: 10,
  },
];

vi.mock('../hooks/promotions.queries', () => ({
  useAdminPromotions: () => ({
    data: { items: mockPromotions },
    isLoading: false,
  }),
}));

vi.mock('../hooks/promotions.mutations', () => ({
  useActivatePromotionPackage: () => ({ mutate: vi.fn(), isPending: false }),
  useDeactivatePromotionPackage: () => ({ mutate: vi.fn(), isPending: false }),
}));

describe('<PromotionTable />', () => {
  it('renders promotion items and filters by search query', () => {
    renderWithProviders(<PromotionTable initialPromotions={mockPromotions} />);

    expect(screen.getAllByText('Toyota Prius 2015 Silver')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Modern Villa Sen Sok')[0]).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/search listing, seller, or id/i);
    fireEvent.change(searchInput, { target: { value: 'Prius' } });

    expect(screen.getAllByText('Toyota Prius 2015 Silver')[0]).toBeInTheDocument();
    expect(screen.queryAllByText('Modern Villa Sen Sok')).toHaveLength(0);
  });

  it('renders empty state when no items match the filter', () => {
    renderWithProviders(<PromotionTable initialPromotions={mockPromotions} />);

    const searchInput = screen.getByPlaceholderText(/search listing, seller, or id/i);
    fireEvent.change(searchInput, { target: { value: 'Nonexistent Listing XYZ' } });

    expect(screen.getAllByText(/no promotions found/i)[0]).toBeInTheDocument();
  });
});


import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { ListingTable } from './listing-table';
import type { AdminListing } from '../types';

const mockListings: AdminListing[] = [
  {
    id: 'list-1',
    title: 'Honda Click 125i 2022',
    slug: 'honda-click-125i-2022',
    price: 1850,
    currency: 'USD',
    status: 'active',
    categoryId: 'cat-1',
    categoryName: 'Motorcycles',
    categoryPath: ['Vehicles', 'Motorcycles'],
    condition: 'Used',
    description: 'Good condition motorbike',
    specifications: [],
    history: [],
    favoriteCount: 5,
    seller: {
      id: 'seller-1',
      name: 'Rithy Motor',
      avatar: '',
      sellerType: 'dealer',
      verified: true,
      joinedDate: '2025-01-01',
      activeListings: 12,
    },
    location: {
      province: 'Phnom Penh',
      district: 'Toul Kork',
    },
    images: [{ id: 'img-1', url: 'http://localhost/img1.jpg', isPrimary: true }],
    createdAt: '2026-01-01',
    createdDate: '2026-01-01',
    reports: [],
    viewCount: 150,
  },
  {
    id: 'list-2',
    title: 'iPhone 13 128GB Midnight',
    slug: 'iphone-13-128gb',
    price: 450,
    currency: 'USD',
    status: 'pending',
    categoryId: 'cat-2',
    categoryName: 'Phones',
    categoryPath: ['Electronics', 'Phones'],
    condition: 'Used - Like New',
    description: 'Original box included',
    specifications: [],
    history: [],
    favoriteCount: 2,
    seller: {
      id: 'seller-2',
      name: 'Sok Mean',
      avatar: '',
      sellerType: 'individual',
      verified: false,
      joinedDate: '2025-06-01',
      activeListings: 2,
    },
    location: {
      province: 'Siem Reap',
      district: 'Siem Reap',
    },
    images: [{ id: 'img-2', url: 'http://localhost/img2.jpg', isPrimary: true }],
    createdAt: '2026-01-02',
    createdDate: '2026-01-02',
    reports: [],
    viewCount: 45,
  },
];

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('../hooks/listings.queries', () => ({
  useAdminListings: () => ({
    data: { items: mockListings },
    isLoading: false,
  }),
}));

vi.mock('../hooks/listings.mutations', () => ({
  useApproveListing: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

vi.mock('@/features/admin/categories/hooks/categories.queries', () => ({
  useAdminCategories: () => ({
    data: [{ id: 'cat-1', name: 'Motorcycles', subcategories: [] }],
  }),
}));

vi.mock('@/features/admin/locations/hooks/locations.queries', () => ({
  useAdminProvinces: () => ({
    data: [{ id: 1, name: 'Phnom Penh' }, { id: 2, name: 'Siem Reap' }],
  }),
}));

describe('<ListingTable />', () => {
  it('renders listings, price, categories, and locations', () => {
    renderWithProviders(<ListingTable />);

    expect(screen.getAllByText('Honda Click 125i 2022')[0]).toBeInTheDocument();
    expect(screen.getAllByText('$1,850')[0]).toBeInTheDocument();
    expect(screen.getAllByText('iPhone 13 128GB Midnight')[0]).toBeInTheDocument();
    expect(screen.getAllByText('$450')[0]).toBeInTheDocument();
  });

  it('filters listings by status tab', () => {
    renderWithProviders(<ListingTable />);

    const pendingTab = screen.getByRole('button', { name: /pending review/i });
    fireEvent.click(pendingTab);

    expect(screen.getAllByText('iPhone 13 128GB Midnight')[0]).toBeInTheDocument();
    expect(screen.queryAllByText('Honda Click 125i 2022')).toHaveLength(0);
  });

  it('filters listings by search input', () => {
    renderWithProviders(<ListingTable />);

    const searchInput = screen.getByPlaceholderText(/search listing title, ID, seller or location/i);
    fireEvent.change(searchInput, { target: { value: 'Honda' } });

    expect(screen.getAllByText('Honda Click 125i 2022')[0]).toBeInTheDocument();
    expect(screen.queryAllByText('iPhone 13 128GB Midnight')).toHaveLength(0);
  });
});


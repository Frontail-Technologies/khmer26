import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { PromoteListingDialog } from './promote-listing-dialog';
import type { AccountListingItem } from '../../types';

const applyPromotion = vi.fn();
let creditsRemaining = 1;

vi.mock('../api/account-listings.queries', () => ({
  usePromotionPackages: () => ({
    data: [{
      id: 'featured-package',
      name: 'Featured Listing',
      description: 'Appear in featured sections.',
      promotionType: 'featured',
      durationDays: 7,
      price: '10',
      currency: 'USD',
      isActive: true,
    }],
    isLoading: false,
    isError: false,
  }),
}));

vi.mock('../api/account-listings.mutations', () => ({
  useApplyListingPromotion: () => ({ mutate: applyPromotion, isPending: false }),
}));

vi.mock('../../subscription/api/subscription.queries', () => ({
  useSubscriptionUsage: () => ({
    data: { remainingFeaturedCredits: creditsRemaining, remainingBumpCredits: 0 },
    isLoading: false,
    isError: false,
  }),
}));

const startCheckout = vi.fn();
let paymentsAvailable = false;
const requireAuth = vi.fn((action: () => unknown) => action());

vi.mock('@/features/payments/api/payments.queries', () => ({
  usePaymentsAvailability: () => ({ isEnabled: paymentsAvailable, isLoading: false }),
  useStartCheckout: () => ({ mutate: startCheckout, isPending: false }),
}));

vi.mock('@/features/auth/hooks/use-require-auth', () => ({
  useRequireAuth: () => requireAuth,
}));

const listing = {
  id: 'listing-1',
  title: 'Honda Civic',
  status: 'active',
} as AccountListingItem;

describe('<PromoteListingDialog />', () => {
  beforeEach(() => {
    applyPromotion.mockClear();
    startCheckout.mockClear();
    paymentsAvailable = false;
    creditsRemaining = 1;
  });

  it('activates a live package with an available plan credit', () => {
    renderWithProviders(
      <PromoteListingDialog listing={listing} open onOpenChange={vi.fn()} />
    );

    expect(screen.getByText(/1 plan credit remaining/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /use plan credit/i }));

    expect(applyPromotion).toHaveBeenCalledWith(
      { listingId: 'listing-1', packageId: 'featured-package' },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    );
  });

  it('offers paid checkout, not a credit, when no credit is left and payments are on', () => {
    paymentsAvailable = true;
    creditsRemaining = 0;
    renderWithProviders(
      <PromoteListingDialog listing={listing} open onOpenChange={vi.fn()} />
    );

    fireEvent.click(screen.getByRole('button', { name: /pay \$10/i }));

    expect(startCheckout).toHaveBeenCalledWith({
      purpose: 'promotion',
      listingId: 'listing-1',
      packageId: 'featured-package',
    });
    expect(applyPromotion).not.toHaveBeenCalled();
  });

  it('cannot activate without a credit while payments are off', () => {
    creditsRemaining = 0;
    renderWithProviders(
      <PromoteListingDialog listing={listing} open onOpenChange={vi.fn()} />
    );

    expect(screen.getByRole('button', { name: /no credit available/i })).toBeDisabled();
  });
});

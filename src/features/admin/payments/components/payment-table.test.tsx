import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { PaymentTable } from './payment-table';
import type { AdminPaymentTransaction } from '../types';

const mockPayments: AdminPaymentTransaction[] = [
  {
    id: 'tx-1',
    transactionReference: 'PAY-10001',
    payerId: 'user-1',
    payerName: 'Chann Vanna',
    payerPhone: '012345678',
    payerEmail: 'vanna@example.com',
    amount: 50,
    currency: 'USD',
    purpose: 'subscription',
    purposeTitle: 'Seller Plus 1-Month',
    status: 'successful',
    createdAt: '2026-01-01 10:00',
    paymentMethod: 'ABA KHQR',
  },
  {
    id: 'tx-2',
    transactionReference: 'PAY-10002',
    payerId: 'user-2',
    payerName: 'Heng Piseth',
    payerPhone: '098765432',
    payerEmail: 'piseth@example.com',
    amount: 15,
    currency: 'USD',
    purpose: 'promotion',
    purposeTitle: 'Featured 7-Day',
    status: 'failed',
    createdAt: '2026-01-02 12:00',
    paymentMethod: 'ABA KHQR',
  },
];

vi.mock('../hooks/payments.queries', () => ({
  useAdminPayments: () => ({
    data: { items: mockPayments },
    isLoading: false,
  }),
}));

describe('<PaymentTable />', () => {
  it('renders payment transactions and transaction reference', () => {
    renderWithProviders(<PaymentTable initialPayments={mockPayments} />);

    expect(screen.getAllByText('Chann Vanna')[0]).toBeInTheDocument();
    expect(screen.getAllByText('PAY-10001')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Heng Piseth')[0]).toBeInTheDocument();
  });

  it('filters payments when searching by payer name', () => {
    renderWithProviders(<PaymentTable initialPayments={mockPayments} />);

    const searchInput = screen.getByPlaceholderText(/search payment id, reference, or payer/i);
    fireEvent.change(searchInput, { target: { value: 'Chann' } });

    expect(screen.getAllByText('Chann Vanna')[0]).toBeInTheDocument();
    expect(screen.queryAllByText('Heng Piseth')).toHaveLength(0);
  });

  it('filters transactions by subscription and promotion tabs', () => {
    renderWithProviders(<PaymentTable initialPayments={mockPayments} />);

    const promoTab = screen.getByRole('button', { name: /promotions/i });
    fireEvent.click(promoTab);

    expect(screen.getAllByText('Heng Piseth')[0]).toBeInTheDocument();
    expect(screen.queryAllByText('Chann Vanna')).toHaveLength(0);
  });
});

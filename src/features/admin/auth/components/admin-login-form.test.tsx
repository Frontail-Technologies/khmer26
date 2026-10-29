import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { AdminLoginForm } from './admin-login-form';

const mockLogin = vi.fn();
let mockIsLoggingIn = false;

vi.mock('@/hooks/use-admin-auth', () => ({
  useAdminAuth: () => ({
    login: mockLogin,
    isLoggingIn: mockIsLoggingIn,
  }),
}));

describe('<AdminLoginForm />', () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockIsLoggingIn = false;
  });

  it('renders login form inputs and actions', () => {
    renderWithProviders(<AdminLoginForm />);

    expect(screen.getByText('Admin Sign In', { selector: '[data-slot="card-title"]' })).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument();
  });

  it('ships no demo credentials or prefill button', () => {
    const { container } = renderWithProviders(<AdminLoginForm />);

    expect(screen.queryByRole('button', { name: /fill credentials/i })).toBeNull();
    expect(screen.queryByText(/demo account/i)).toBeNull();
    expect(container.textContent).not.toMatch(/Admin@offerupkh/);
    expect(screen.getByLabelText(/^email$/i)).toHaveValue('');
    expect(screen.getByLabelText(/^password$/i)).toHaveValue('');
  });

  it('submits email and password to login mutation', async () => {
    mockLogin.mockResolvedValueOnce({ user: { id: '1' } });
    renderWithProviders(<AdminLoginForm />);

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'admin@khmer26.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'correct-horse-battery' },
    });

    const submitButton = screen.getByRole('button', { name: /^sign in$/i });
    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'admin@khmer26.com',
      password: 'correct-horse-battery',
    });
  });

  it('displays validation error if submitted without email or password', async () => {
    renderWithProviders(<AdminLoginForm />);

    const form = screen.getByRole('button', { name: /^sign in$/i }).closest('form')!;
    fireEvent.submit(form);

    expect(mockLogin).not.toHaveBeenCalled();
    expect(await screen.findByText(/please enter your email and password/i)).toBeInTheDocument();
  });
});

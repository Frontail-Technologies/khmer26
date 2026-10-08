'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authKeys } from '@/lib/query/keys';
import * as authApi from '../api/auth.api';
import { ApiError } from '@/lib/api/client';

const PENDING_EMAIL_KEY = 'auth_pending_email';
const RESET_TOKEN_KEY = 'auth_reset_token';

export function getAuthPendingEmail(): string {
  if (typeof window === 'undefined') return '';
  return window.sessionStorage.getItem(PENDING_EMAIL_KEY) ?? '';
}

export function setAuthPendingEmail(email: string): void {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(PENDING_EMAIL_KEY, email);
  }
}

export function clearAuthPendingEmail(): void {
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(PENDING_EMAIL_KEY);
  }
}

export function getResetToken(): string {
  if (typeof window === 'undefined') return '';
  return window.sessionStorage.getItem(RESET_TOKEN_KEY) ?? '';
}

export function setResetToken(token: string): void {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(RESET_TOKEN_KEY, token);
  }
}

export function clearResetToken(): void {
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(RESET_TOKEN_KEY);
  }
}

function friendlyAuthError(err: unknown): string {
  if (!(err instanceof ApiError)) return 'Something went wrong. Please try again.';
  switch (err.code) {
    case 'INVALID_CREDENTIALS': return 'Incorrect email or password.';
    case 'ACCOUNT_UNAVAILABLE': return 'Your account is suspended. Please contact support.';
    case 'ACCOUNT_ALREADY_EXISTS': return 'An account with this email already exists.';
    case 'EMAIL_ALREADY_REGISTERED': return 'This email is already registered.';
    case 'INVALID_OTP': return 'Invalid verification code. Please try again.';
    case 'OTP_EXPIRED': return 'Verification code has expired. Please request a new one.';
    case 'OTP_MAX_ATTEMPTS': return 'Too many failed attempts. Please request a new code.';
    case 'RATE_LIMIT_EXCEEDED':
    case 'TOO_MANY_REQUESTS': return 'Too many attempts. Please wait a moment and try again.';
    case 'RESEND_COOLDOWN': return 'Please wait before requesting a new code.';
    default:
      if (err.status === 429) return 'Too many attempts. Please wait a moment and try again.';
      if (err.status >= 500) return 'Server error. Please try again later.';
      return err.message || 'Something went wrong. Please try again.';
  }
}

export function resolveNextPath(): string {
  if (typeof window === 'undefined') return '/';
  const next = new URLSearchParams(window.location.search).get('next');
  if (next && next.startsWith('/') && !next.startsWith('//') && !next.includes('\\')) {
    return next;
  }
  return '/';
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.session(), user);
      router.push(resolveNextPath());
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.register(email, password),
    onSuccess: (_data, variables) => {
      setAuthPendingEmail(variables.email);
      router.push('/register/verify');
    },
  });
}

export function useVerifyRegistration() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      authApi.verifyRegistration(email, otp),
    onSuccess: (user) => {
      clearAuthPendingEmail();
      queryClient.setQueryData(authKeys.session(), user);
      router.push('/');
    },
  });
}

export function useResendRegistrationOtp() {
  return useMutation({
    mutationFn: (email: string) => authApi.resendRegistrationOtp(email),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      router.push('/');
    },
  });
}

export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: (_data, email) => {
      setAuthPendingEmail(email);
      router.push('/forgot-password/verify');
    },
  });
}

export function useVerifyResetOtp() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      authApi.verifyResetOtp(email, otp),
    onSuccess: (data) => {
      setResetToken(data.resetAuthorizationToken);
      clearAuthPendingEmail();
      router.push('/reset-password');
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ resetSecret, newPassword }: { resetSecret: string; newPassword: string }) =>
      authApi.resetPassword(resetSecret, newPassword),
    onSuccess: () => {
      clearResetToken();
    },
  });
}

export function useGoogleAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (idToken: string) => authApi.googleAuth(idToken),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.session(), user);
      router.push(resolveNextPath());
    },
  });
}

export function useTelegramAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: authApi.TelegramAuthPayload) => authApi.telegramAuth(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.session(), user);
      router.push(resolveNextPath());
    },
  });
}

export { friendlyAuthError };

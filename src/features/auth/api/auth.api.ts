import { apiClient } from '@/lib/api/client';

export interface AuthUser {
  id: string;
  email: string | null;
  role: 'user' | 'admin';
  status: string;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export interface AuthResult {
  user: AuthUser;
  csrfToken: string;
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await apiClient.post<AuthResult>('/auth/login', { email, password });
  return res.data.user;
}

export async function register(email: string, password: string): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>('/auth/register', { email, password });
  return res.data;
}

export async function verifyRegistration(email: string, otp: string): Promise<AuthUser> {
  const res = await apiClient.post<AuthResult>('/auth/register/verify', { email, otp });
  return res.data.user;
}

export async function resendRegistrationOtp(email: string): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>('/auth/register/resend', { email });
  return res.data;
}

export async function getMe(): Promise<AuthUser> {
  const res = await apiClient.get<{ user: AuthUser }>('/auth/me');
  return res.data.user;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>('/auth/password/forgot', { email });
  return res.data;
}

export async function verifyResetOtp(email: string, otp: string): Promise<{ resetAuthorizationToken: string }> {
  const res = await apiClient.post<{ resetAuthorizationToken: string }>('/auth/password/verify-reset-otp', { email, otp });
  return res.data;
}

export async function resetPassword(resetSecret: string, newPassword: string): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>('/auth/password/reset', { resetSecret, newPassword });
  return res.data;
}

export async function googleAuth(idToken: string): Promise<AuthUser> {
  const res = await apiClient.post<AuthResult>('/auth/google', { idToken });
  return res.data.user;
}

export interface TelegramAuthPayload {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export async function telegramAuth(payload: TelegramAuthPayload): Promise<AuthUser> {
  const res = await apiClient.post<AuthResult>('/auth/telegram', payload);
  return res.data.user;
}

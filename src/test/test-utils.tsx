import React, { ReactElement } from 'react';
import { render, renderHook, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import en from '../../messages/en.json';
import km from '../../messages/km.json';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { queryClient?: QueryClient; locale?: 'en' | 'km' }
) {
  const testQueryClient = options?.queryClient ?? createTestQueryClient();

  function Wrapper({ children }: { children: React.ReactNode }) {
    const locale = options?.locale ?? 'en';
    return (
      <NextIntlClientProvider locale={locale} messages={locale === 'km' ? km : en}>
        <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
      </NextIntlClientProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    queryClient: testQueryClient,
  };
}

/** `renderHook` with the same providers (language catalog, query client) the app has. */
export function renderHookWithProviders<T>(hook: () => T, options?: { locale?: 'en' | 'km' }) {
  const queryClient = createTestQueryClient();
  const locale = options?.locale ?? 'en';
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <NextIntlClientProvider locale={locale} messages={locale === 'km' ? km : en}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </NextIntlClientProvider>
    );
  }
  return renderHook(hook, { wrapper: Wrapper });
}

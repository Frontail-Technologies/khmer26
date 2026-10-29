import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, Geist_Mono, Noto_Sans_Khmer } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import type { ReactNode } from "react"
import "./globals.css"
import { AppProviders } from "@/providers/AppProviders"
import { AppHeader } from "@/components/layout/AppHeader"
import { AppFooter } from "@/components/layout/AppFooter"
import { MobileBottomNavigation } from "@/components/layout/MobileBottomNavigation"
import { SEO } from "@/lib/constants/site"
import { cn } from "@/lib/utils"
import { cookies, headers } from "next/headers"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { authKeys } from "@/lib/query/keys"
import { getServerCurrentUser } from "@/features/auth/api/auth.server"
import { isAdminHostname, normalizeHostname } from "@/lib/admin-host"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
})

// Plus Jakarta Sans has no Khmer glyphs; Khmer text falls back to this face (see globals.css).
const notoSansKhmer = Noto_Sans_Khmer({
  subsets: ["khmer"],
  variable: "--font-khmer",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1d26" },
  ],
}

export const metadata: Metadata = {
  title: {
    default: SEO.defaultTitle,
    template: SEO.titleTemplate,
  },
  description: SEO.defaultDescription,
  metadataBase: new URL("https://khmer26.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "offerupkh",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [locale, messages, cookieStore, headerStore] = await Promise.all([
    getLocale(),
    getMessages(),
    cookies(),
    headers(),
  ])
  const requestHostname = normalizeHostname(
    headerStore.get("x-forwarded-host") || headerStore.get("host")
  )
  const isAdminRequest = isAdminHostname(requestHostname)
  const queryClient = new QueryClient()
  const hasAccessCookie = cookieStore.has("k26_access_dev") || cookieStore.has("__Host-k26_access")
  const hasSessionCookie = cookieStore.has("k26_session_dev") || cookieStore.has("__Secure-k26_session")

  if (!hasAccessCookie && !hasSessionCookie) {
    queryClient.setQueryData(authKeys.session(), null)
  } else if (hasAccessCookie) {
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
      .join("; ")
    await queryClient.prefetchQuery({
      queryKey: authKeys.session(),
      queryFn: () => getServerCurrentUser(cookieHeader),
      staleTime: 5 * 60 * 1000,
    })
  }
  const dehydratedState = dehydrate(queryClient)

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(plusJakartaSans.variable, notoSansKhmer.variable, geistMono.variable, "h-full font-sans")}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-background antialiased overflow-x-clip"
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders dehydratedState={dehydratedState}>
            {isAdminRequest ? (
              children
            ) : (
              <>
                <AppHeader />
                <main className="flex-1" suppressHydrationWarning>{children}</main>
                <AppFooter />
                <MobileBottomNavigation />
              </>
            )}
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

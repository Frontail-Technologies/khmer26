import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import type { ReactNode } from "react"
import "./globals.css"
import { AppProviders } from "@/providers/AppProviders"
import { AppHeader } from "@/components/layout/AppHeader"
import { AppFooter } from "@/components/layout/AppFooter"
import { MobileBottomNavigation } from "@/components/layout/MobileBottomNavigation"
import { SEO } from "@/lib/constants/site"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    siteName: "Khmer26",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(inter.variable, geistMono.variable, "h-full")}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-background antialiased overflow-x-clip"
      >
        <AppProviders>
          <AppHeader />
          <main className="flex-1">{children}</main>
          <AppFooter />
          <MobileBottomNavigation />
        </AppProviders>
      </body>
    </html>
  )
}

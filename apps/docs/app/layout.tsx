import type { Metadata, Viewport } from 'next'
import { Outfit as FontHeading, Inter as FontSans } from 'next/font/google'
import Script from 'next/script'
import { Toaster as Sonner, Toaster } from '@timui/react'

import Footer from '@/components/footer'
import Header from '@/components/header'
import LayoutWrapper from '@/components/layout-wrapper'
import { ThemeProvider } from '@/components/theme-provider'

import './globals.css'
import './prismjs-theme.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontHeading = FontHeading({
  subsets: ['latin'],
  variable: '--font-heading',
})

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
  maximumScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://ui.timkit.cn'),
  title: 'Timkit UI - Beautiful UI components built with Tailwind CSS and React',
  description:
    'An extensive collection of copy-and-paste components for quickly building app UIs. Free, open-source, and ready to drop into your projects.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontHeading.variable} font-sans tracking-[-0.25px] antialiased has-not-data-home:before:absolute has-not-data-home:before:inset-x-0 has-not-data-home:before:h-100 has-not-data-home:before:bg-linear-to-b has-not-data-home:before:from-zinc-100 has-data-home:bg-zinc-50 dark:has-not-data-home:before:hidden dark:has-data-home:bg-zinc-950`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutWrapper>
            <Header />
            <main className="grow">{children}</main>
            <Footer />
          </LayoutWrapper>
          <Toaster />
          <Sonner />
        </ThemeProvider>
        <Script
          src="https://plausible.cruip.com/js/script.js"
          data-domain="originui.com"
          strategy="beforeInteractive"
          defer
        />
      </body>
    </html>
  )
}

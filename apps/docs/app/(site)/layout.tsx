import Script from 'next/script'
import { Toaster as Sonner, Toaster } from '@timui/react'

import Footer from '@/components/footer'
import Header from '@/components/header'
import LayoutWrapper from '@/components/layout-wrapper'
import { ThemeProvider } from '@/components/theme-provider'

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
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
        data-domain="ui.timkit.cn"
        strategy="beforeInteractive"
        defer
      />
    </>
  )
}

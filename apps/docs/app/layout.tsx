import type { Metadata, Viewport } from 'next'

import './globals.css'
import './prismjs-theme.css'

import { FrameworkProvider } from '@/hooks/framework-context'

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
    <html lang="en" suppressHydrationWarning className="font-sans">
      <body className="font-sans antialiased text-foreground bg-background">
        <FrameworkProvider>{children}</FrameworkProvider>
      </body>
    </html>
  )
}

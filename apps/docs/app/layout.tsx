import type { Metadata, Viewport } from 'next'

import './globals.css'
import './prismjs-theme.css'

import { FrameworkProvider } from '@/hooks/framework-context'

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://ui.timkit.cn'),
  title: 'Timkit UI - Agent-native mobile UI registry, blocks, and templates',
  description:
    'A mobile-first UI component, block, and template registry built for agents, CLIs, React, Vue, HTML, and WeApp.',
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

'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@timui/core'

interface LayoutWrapperProps {
  children: ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isFullWidth = pathname?.startsWith('/components')

  if (isFullWidth) {
    return <div className="relative flex min-h-screen flex-col">{children}</div>
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative flex flex-col min-h-[600px] vant-card">{children}</div>
      </div>
    </div>
  )
}

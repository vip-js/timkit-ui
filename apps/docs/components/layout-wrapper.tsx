'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@timui/shared'

interface LayoutWrapperProps {
  children: ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isFullWidth = pathname?.startsWith('/components')

  if (isFullWidth) {
    return <div className="relative flex min-h-screen flex-col bg-background">{children}</div>
  }

  return (
    <div className="overflow-hidden px-4 supports-[overflow:clip]:overflow-clip sm:px-6">
      <div className="before:bg-[linear-gradient(to_bottom,--theme(--color-border/.3),--theme(--color-border)_200px,--theme(--color-border)_calc(100%-200px),--theme(--color-border/.3))] after:bg-[linear-gradient(to_bottom,--theme(--color-border/.3),--theme(--color-border)_200px,--theme(--color-border)_calc(100%-200px),--theme(--color-border/.3))] relative mx-auto w-full max-w-6xl before:absolute before:inset-y-0 before:-left-12 before:w-px after:absolute after:inset-y-0 after:-right-12 after:w-px">
        <div className="relative flex min-h-screen flex-col">{children}</div>
      </div>
    </div>
  )
}

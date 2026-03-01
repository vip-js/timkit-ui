import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

import LazyMotionWrapper from '@/components/lazy-motion-wrapper'
import { TabsTrigger as UiTabsTrigger } from '@/registry/default/ui/tabs'

export const TabsTrigger = ({
  children,
  value,
  selectedTab,
  disabled,
}: {
  children: React.ReactNode
  value: string
  selectedTab: string
  disabled?: boolean
}) => (
  <UiTabsTrigger
    className="relative flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground/80 transition-all duration-200 hover:text-foreground active:scale-95 disabled:opacity-50 data-[state=active]:text-foreground"
    value={value}
    disabled={disabled}
  >
    <span className="relative z-10">{children}</span>
    {selectedTab == value && (
      <LazyMotionWrapper>
        <motion.span
          className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground"
          layoutId="activeTab"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      </LazyMotionWrapper>
    )}
  </UiTabsTrigger>
)

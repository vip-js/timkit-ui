'use client'

import * as React from 'react'
import { cn } from '@timui/core'

const ProfileBg = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="profile-bg"
      className={cn(
        'h-24 w-full rounded-t-md bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100',
        className
      )}
      {...props}
    />
  )
)
ProfileBg.displayName = 'ProfileBg'

export { ProfileBg }

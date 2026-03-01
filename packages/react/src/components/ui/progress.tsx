'use client'

import * as React from 'react'
import { progressIndicatorVariants, progressRootVariants } from '@timui/core'
import { cn } from '@timui/core'
import { useProgress } from './progress/use-progress'

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number | null; max?: number }
>(({ className, value, max = 100, ...props }, ref) => {

  const { progressValue, percent } = useProgress({ value, max })

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemax={max}
      aria-valuemin={0}
      aria-valuenow={value ?? undefined}
      data-max={max}
      data-value={value}
      data-state={progressValue === null ? 'indeterminate' : 'loading'}
      className={cn(progressRootVariants(), className)}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className={progressIndicatorVariants()}
        style={{ transform: `translateX(-${100 - percent}%)` }}
      />
    </div>
  )
})
Progress.displayName = "Progress"

export { Progress }

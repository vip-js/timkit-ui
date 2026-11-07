'use client'

import * as React from 'react'
import { cn, progressIndicatorVariants, progressRootVariants } from '@timui/core'

import { useProgress } from './progress/use-progress'

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number | null; max?: number }
>(({ className, value, max = 100, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, ...props }, ref) => {
  const { progressValue, percent } = useProgress({ value, max })
  const valueText = progressValue == null ? undefined : `${Math.round(percent)}%`

  return (
    <div
      ref={ref}
      data-slot="progress"
      role="progressbar"
      aria-valuemax={max}
      aria-valuemin={0}
      aria-valuenow={value ?? undefined}
      aria-valuetext={valueText}
      data-max={max}
      data-value={value}
      data-state={progressValue === null ? 'indeterminate' : 'loading'}
      className={cn(progressRootVariants(), className)}
      {...props}
      aria-labelledby={ariaLabelledBy}
      aria-label={
        ariaLabelledBy ? undefined : typeof ariaLabel === 'string' && ariaLabel ? ariaLabel : 'Progress'
      }
    >
      <div
        data-slot="progress-indicator"
        className={progressIndicatorVariants()}
        style={{ transform: `translateX(-${100 - percent}%)` }}
      />
      {valueText ? <span data-slot="progress-value">{valueText}</span> : null}
    </div>
  )
})
Progress.displayName = 'Progress'

export { Progress }

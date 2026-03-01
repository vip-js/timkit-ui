'use client'

import * as React from 'react'
import { cn, progressMachine } from '@timui/core'

import { useMachine } from '../hooks/use-machine'

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number | null; max?: number }
>(({ className, value, max = 100, ...props }, ref) => {
  const [state, send] = useMachine(progressMachine, {
    context: {
      value,
      max,
    },
  })

  // Computed percent logic in machine or here?
  // Machine has computed.percent but simple math here is fine too.
  const percent =
    state.context.value != null ? Math.round((state.context.value / state.context.max) * 100) : 0

  React.useEffect(() => {
    if (value !== undefined && value !== state.context.value) {
      send({ type: 'VALUE.SET', value })
    }
  }, [value, send, state.context.value])

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemax={max}
      aria-valuemin={0}
      aria-valuenow={value ?? undefined}
      data-max={max}
      data-value={value}
      data-state={state.context.value === null ? 'indeterminate' : 'loading'}
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', className)}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  )
})
Progress.displayName = 'Progress'

export { Progress }

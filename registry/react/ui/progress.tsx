'use client'

import * as React from 'react'
import * as progress from '@zag-js/progress'
import { normalizeProps, useMachine } from '@zag-js/react'
import { cva } from '../lib/cva'
import { cn } from '../lib/utils'

const progressRootVariants = cva(
    'relative h-2 w-full overflow-hidden rounded-full bg-secondary'
)
const progressIndicatorVariants = cva('h-full w-full flex-1 bg-primary transition-all')

const Progress = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value?: number | null; max?: number }
>(({ className, value, max = 100, ...props }, ref) => {
    const service: progress.Service = useMachine(progress.machine, {
        id: React.useId(),
        value: value ?? undefined, // Zag expects number | null | undefined, but if null passed as prop it might mean indeterminate?
        max,
    })


    const api = progress.connect(service, normalizeProps)

    return (
        <div
            ref={ref}
            {...api.getRootProps()}
            className={cn(progressRootVariants(), className)}
            {...props}
        >
            <div
                className={progressIndicatorVariants()}
                style={{ transform: `translateX(-${100 - (api.percent || 0)}%)` }}
            />
        </div>
    )
})
Progress.displayName = "Progress"

export { Progress }

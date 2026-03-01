'use client'

import * as React from 'react'
import { cva } from '../lib/cva'
import { cn } from '../lib/utils'

const scrollAreaVariants = cva('relative overflow-hidden')
const scrollAreaViewportVariants = cva('h-full w-full rounded-[inherit]')
const scrollAreaScrollbarVariants = cva(
    'flex touch-none select-none transition-colors data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:border-l data-[orientation=vertical]:border-l-transparent data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-t-transparent'
)
const scrollAreaThumbVariants = cva('bg-border relative flex-1 rounded-full')

const ScrollArea = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { scrollBarClassName?: string, orientation?: 'vertical' | 'horizontal' }
>(({ className, children, orientation = 'vertical', scrollBarClassName, ...props }, ref) => (
    <div
        ref={ref}
        data-slot="scroll-area"
        className={cn(scrollAreaVariants(), className)}
        {...props}
    >
        <div
            data-slot="scroll-viewport"
            className={cn(
                scrollAreaViewportVariants(),
                scrollBarClassName,
                orientation === 'vertical' ? 'overflow-y-auto' : 'overflow-x-auto'
            )}
        >
            {children}
        </div>
    </div>
))
ScrollArea.displayName = "ScrollArea"

const ScrollBar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { orientation?: 'vertical' | 'horizontal' }
>(({ className, orientation = 'vertical', ...props }, ref) => (
    null
))
ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }

import { cva } from 'class-variance-authority'

export const scrollAreaVariants = cva('relative overflow-hidden')
export const scrollAreaViewportVariants = cva('h-full w-full rounded-[inherit]')
export const scrollAreaScrollbarVariants = cva(
    'flex touch-none select-none transition-colors data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:border-l data-[orientation=vertical]:border-l-transparent data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-t-transparent'
)
export const scrollAreaThumbVariants = cva('bg-border relative flex-1 rounded-full')

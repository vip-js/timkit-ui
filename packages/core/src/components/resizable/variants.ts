import { cva } from 'class-variance-authority'

export const resizableRootVariants = cva(
    'flex h-full w-full data-[direction=vertical]:flex-col'
)
export const resizablePanelGroupVariants = resizableRootVariants
export const resizableHandleVariants = cva(
    'bg-border relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[direction=vertical]:h-px data-[direction=vertical]:w-full data-[direction=vertical]:after:inset-x-0 data-[direction=vertical]:after:top-1/2 data-[direction=vertical]:after:h-1 data-[direction=vertical]:after:-translate-y-1/2'
)
export const resizableHandleIconVariants = cva(
    'bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border'
)

import { cva } from 'class-variance-authority'

export const selectTriggerVariants = cva(
    'border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
)
export const selectTriggerIconVariants = cva('h-4 w-4 opacity-50')
export const selectContentVariants = cva(
    'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border shadow-md'
)
export const selectContentPopperVariants = cva(
    'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1'
)
export const selectItemVariants = cva(
    'focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-8 ps-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
)
export const selectLabelVariants = cva('py-1.5 pl-8 pr-2 text-sm font-semibold')
export const selectSeparatorVariants = cva('-mx-1 my-1 h-px bg-muted')
export const selectValueVariants = cva(
    'line-clamp-1 pointer-events-none data-[placeholder]:text-muted-foreground'
)

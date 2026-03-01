import { cva } from 'class-variance-authority'

export const radioGroupVariants = cva('grid gap-3')
export const radioGroupItemVariants = cva(
    'border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50'
)
export const radioGroupIndicatorVariants = cva('flex items-center justify-center')
export const radioGroupIndicatorIconVariants = cva('h-2.5 w-2.5 fill-current text-current')

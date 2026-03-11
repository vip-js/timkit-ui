import { cva } from 'class-variance-authority'

export const checkboxRootVariants = cva('inline-flex items-center')
export const checkboxVariants = cva(
  'peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex size-4 shrink-0 items-center justify-center rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50'
)
export const checkboxIndicatorVariants = cva(
  'flex items-center justify-center text-current opacity-0 transition-opacity duration-100'
)
export const checkboxIndicatorCheckVariants = cva('h-0.5 w-2 rounded-full bg-current')
export const checkboxIndicatorIconVariants = cva('size-3.5')

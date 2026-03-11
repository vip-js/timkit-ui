import { cva } from 'class-variance-authority'

export const comboboxVariants = cva('')
export const comboboxRootVariants = cva('flex flex-col gap-1')
export const comboboxControlVariants = cva(
  'flex items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-within:outline-none focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
)
export const comboboxInputVariants = cva(
  'flex-1 bg-transparent outline-none placeholder:text-muted-foreground'
)
export const comboboxPositionerVariants = cva('relative')
export const comboboxContentVariants = cva(
  'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md'
)
export const comboboxListVariants = cva('max-h-60 overflow-y-auto p-1')
export const comboboxItemVariants = cva(
  'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
)
export const comboboxItemIndicatorVariants = cva(
  'absolute left-2 flex h-3.5 w-3.5 items-center justify-center'
)
export const comboboxItemTextVariants = cva('ps-6')
export const comboboxLabelVariants = cva('px-2 py-1.5 text-sm font-semibold')
export const comboboxGroupLabelVariants = cva(
  'px-2 py-1.5 text-xs font-medium text-muted-foreground'
)
export const comboboxEmptyVariants = cva('py-6 text-center text-sm text-muted-foreground')

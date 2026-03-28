import { cva } from 'class-variance-authority'

export const numberFieldVariants = cva('w-full')

export const numberFieldControlVariants = cva('flex items-center')

export const numberFieldInputVariants = cva(
  'h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs'
)

export const numberFieldIncrementVariants = cva(
  'inline-flex h-9 w-9 items-center justify-center rounded-md border border-input'
)

export const numberFieldDecrementVariants = cva(
  'inline-flex h-9 w-9 items-center justify-center rounded-md border border-input'
)

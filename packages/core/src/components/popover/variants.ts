import { cva } from 'class-variance-authority'

export const popoverContentVariants = cva(
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2px] data-[state=open]:slide-in-from-top-[2px] z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none'
)

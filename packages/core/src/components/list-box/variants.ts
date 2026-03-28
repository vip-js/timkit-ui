import { cva } from 'class-variance-authority'

export const listBoxVariants = cva('')
export const listBoxRootVariants = cva('')
export const listBoxListVariants = cva('outline-none')
export const listBoxItemVariants = cva(
  'relative cursor-default select-none outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
)
export const listBoxSectionVariants = cva('')

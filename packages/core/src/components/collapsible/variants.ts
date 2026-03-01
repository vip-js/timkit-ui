import { cva } from 'class-variance-authority'

export const collapsibleRootVariants = cva('')
export const collapsibleTriggerVariants = cva('')
export const collapsibleContentVariants = cva(
    'overflow-hidden transition-all data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up'
)

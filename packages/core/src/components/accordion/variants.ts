import { cva } from 'class-variance-authority'

export const accordionItemVariants = cva('w-full border-b last:border-b-0')
export const accordionTriggerVariants = cva(
    'focus-visible:border-ring focus-visible:ring-ring/50 flex w-full flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-semibold transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180'
)
export const accordionTriggerInlineVariants = cva(
    'flex w-full flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180'
)
export const accordionTriggerIconVariants = cva(
    'pointer-events-none shrink-0 opacity-60 transition-transform duration-200'
)
export const accordionContentVariants = cva(
    'overflow-hidden text-sm transition-all data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up'
)
export const accordionContentInnerVariants = cva('pt-0 pb-4')

import { cva } from 'class-variance-authority'

export const datePickerVariants = cva('')
export const datePickerRootVariants = cva('w-full')
export const datePickerTriggerVariants = cva('w-full')
export const datePickerTriggerButtonVariants = cva(
  'bg-background border-input w-full justify-between px-3 text-sm font-normal outline-offset-0 outline-none focus-visible:outline-[3px]'
)
export const datePickerTriggerIconVariants = cva('text-muted-foreground/80 -ms-1 shrink-0')
export const datePickerTriggerLabelVariants = cva('truncate')
export const datePickerTriggerLabelEmptyVariants = cva('font-medium')
export const datePickerContentVariants = cva('w-auto p-2')

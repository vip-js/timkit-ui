import { cva } from 'class-variance-authority'

export const notificationVariants = cva(
    'bg-background border-border relative flex w-full flex-col gap-1 rounded-lg border p-4 shadow-lg'
)
export const notificationTitleVariants = cva('text-sm font-semibold')
export const notificationDescriptionVariants = cva('text-muted-foreground text-sm')
export const notificationActionsVariants = cva('flex items-center gap-2')
export const notificationIconVariants = cva('shrink-0')

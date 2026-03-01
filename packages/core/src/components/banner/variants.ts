import { cva } from 'class-variance-authority'

export const bannerVariants = cva(
    'relative flex w-full items-center justify-between gap-4 border-b bg-muted/30 px-4 py-3'
)
export const bannerContentVariants = cva('flex items-center gap-3')
export const bannerIconVariants = cva('size-5 shrink-0')
export const bannerTitleVariants = cva('text-sm font-medium')
export const bannerDescriptionVariants = cva('text-muted-foreground text-sm')
export const bannerActionsVariants = cva('flex items-center gap-2')

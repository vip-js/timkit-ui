import { cva } from 'class-variance-authority'

export const breadcrumbListVariants = cva(
    'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5'
)
export const breadcrumbItemVariants = cva('inline-flex items-center gap-1.5')
export const breadcrumbLinkVariants = cva('transition-colors hover:text-foreground')
export const breadcrumbPageVariants = cva('text-foreground font-normal')
export const breadcrumbSeparatorVariants = cva('')
export const breadcrumbEllipsisVariants = cva('flex size-5 items-center justify-center')

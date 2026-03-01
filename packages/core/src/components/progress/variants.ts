import { cva } from 'class-variance-authority'

export const progressRootVariants = cva(
    'relative h-2 w-full overflow-hidden rounded-full bg-secondary'
)
export const progressIndicatorVariants = cva('h-full w-full flex-1 bg-primary transition-all')
export const progressLabelVariants = cva('text-muted-foreground text-sm font-medium')
export const progressValueTextVariants = cva('text-muted-foreground text-sm font-medium')
export const progressCircleVariants = cva('relative flex items-center justify-center')
export const progressCircleTrackVariants = cva('stroke-muted fill-none')
export const progressCircleRangeVariants = cva('stroke-primary fill-none transition-all')

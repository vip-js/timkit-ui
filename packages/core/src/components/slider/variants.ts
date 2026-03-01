import { cva } from 'class-variance-authority'

export const sliderRootVariants = cva(
    'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col'
)
export const sliderTrackVariants = cva(
    'bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5'
)
export const sliderRangeVariants = cva(
    'bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full'
)
export const sliderThumbVariants = cva(
    'border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] outline-none hover:ring-4 focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50'
)

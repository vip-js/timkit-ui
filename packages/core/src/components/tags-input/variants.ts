import { cva } from 'class-variance-authority'

export const tagsInputRootVariants = cva('flex flex-col gap-2')
export const tagsInputControlVariants = cva(
    'flex flex-wrap gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
)
export const tagsInputInputVariants = cva('flex-1 bg-transparent outline-none placeholder:text-muted-foreground')
export const tagsInputItemVariants = cva(
    'inline-flex items-center gap-1 rounded bg-secondary px-2 py-1 text-sm font-medium text-secondary-foreground hover:bg-secondary/80'
)
export const tagsInputItemSelectedVariants = cva('ring-2 ring-ring ring-offset-2')
export const tagsInputItemDeleteVariants = cva(
    'ml-1 rounded-full outline-none hover:bg-background/20 focus:ring-2 focus:ring-ring focus:ring-offset-1'
)
export const tagsInputClearVariants = cva('text-sm text-muted-foreground hover:text-foreground')

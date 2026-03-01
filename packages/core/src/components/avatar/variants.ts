import { cva } from 'class-variance-authority'

export const avatarRootVariants = cva('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full')
export const avatarVariants = avatarRootVariants
export const avatarImageVariants = cva('aspect-square h-full w-full')
export const avatarFallbackVariants = cva(
    'bg-muted flex h-full w-full items-center justify-center rounded-full'
)

import { cva } from 'class-variance-authority'

export const paginationRootVariants = cva('mx-auto flex w-full justify-center')
export const paginationListVariants = cva('flex flex-row items-center gap-1')
export const paginationFirstVariants = cva('gap-1 px-2.5')
export const paginationLastVariants = cva('gap-1 px-2.5')
export const paginationPreviousVariants = cva('gap-1 px-2.5 sm:pe-4')
export const paginationNextVariants = cva('gap-1 px-2.5 sm:ps-4')
export const paginationEllipsisVariants = cva('flex size-9 items-center justify-center')

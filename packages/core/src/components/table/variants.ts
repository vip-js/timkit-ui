import { cva } from 'class-variance-authority'

export const tableRootVariants = cva('w-full caption-bottom text-sm')
export const tableVariants = tableRootVariants
export const tableHeaderVariants = cva('[&_tr]:border-b')
export const tableBodyVariants = cva('[&_tr:last-child]:border-0')
export const tableFooterVariants = cva('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0')
export const tableRowVariants = cva(
  'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'
)
export const tableHeadVariants = cva(
  'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0'
)
export const tableCellVariants = cva('p-4 align-middle [&:has([role=checkbox])]:pr-0')
export const tableCaptionVariants = cva('mt-4 text-sm text-muted-foreground')

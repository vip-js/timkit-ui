import { cva } from 'class-variance-authority'

export const dialogOverlayVariants = cva(
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80'
)
export const dialogPositionerVariants = cva('fixed inset-0 z-50')
export const dialogContentVariants = cva(
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[48%] data-[state=closed]:slide-out-to-left-[50%] data-[state=open]:slide-in-from-top-[48%] data-[state=open]:slide-in-from-left-[50%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg'
)
export const dialogCloseVariants = cva(
  'ring-offset-background focus:ring-ring absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
)
export const dialogCloseIconVariants = cva('h-4 w-4')
export const dialogHeaderVariants = cva('flex flex-col space-y-1.5 text-center sm:text-left')
export const dialogFooterVariants = cva(
  'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'
)
export const dialogTitleVariants = cva('text-lg font-semibold leading-none tracking-tight')
export const dialogDescriptionVariants = cva('text-sm text-muted-foreground')

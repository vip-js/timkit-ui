import { cva } from 'class-variance-authority'

export const sheetOverlayVariants = cva(
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80'
)
export const sheetContentVariants = cva(
    'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 gap-4 p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
    {
        variants: {
            side: {
                top: 'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 border-b',
                bottom: 'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 border-t',
                left: 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
                right: 'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
            },
        },
        defaultVariants: {
            side: 'right',
        },
    }
)
export const sheetHeaderVariants = cva('flex flex-col space-y-2 text-center sm:text-left')
export const sheetFooterVariants = cva(
    'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'
)
export const sheetTitleVariants = cva('text-foreground text-lg font-semibold')
export const sheetDescriptionVariants = cva('text-muted-foreground text-sm')
export const sheetCloseVariants = cva(
    'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary'
)
export const sheetCloseIconVariants = cva('h-4 w-4')
export const sheetPositionerVariants = cva('fixed inset-0 z-50 flex')

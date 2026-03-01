import { cva } from 'class-variance-authority'

export const selectNativeWrapperVariants = cva('relative flex')
export const selectNativeVariants = cva(
    'border-input text-foreground focus-visible:border-ring focus-visible:ring-ring/50 has-[option[disabled]:checked]:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-full cursor-pointer appearance-none items-center rounded-md border text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            multiple: {
                true: '[&_option:checked]:bg-accent py-1 *:px-3 *:py-1',
                false: 'h-9 ps-3 pe-8',
            },
        },
        defaultVariants: {
            multiple: false,
        },
    }
)
export const selectNativeIndicatorVariants = cva(
    'text-muted-foreground/80 peer-aria-invalid:text-destructive/80 pointer-events-none absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center peer-disabled:opacity-50'
)

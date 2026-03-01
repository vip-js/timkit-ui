import { cva } from 'class-variance-authority'

export const multiselectVariants = cva('')
export const multiselectCommandVariants = cva('h-auto overflow-visible bg-transparent')
export const multiselectContainerVariants = cva(
    'border-input focus-within:border-ring focus-within:ring-ring/50 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive relative min-h-[38px] rounded-md border text-sm transition-[color,box-shadow] outline-none focus-within:ring-[3px] has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50'
)
export const multiselectTagVariants = cva(
    'animate-fadeIn bg-background text-secondary-foreground hover:bg-background relative inline-flex h-7 cursor-default items-center rounded-md border ps-2 pe-7 pl-2 text-xs font-medium transition-all disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-fixed:pe-2'
)
export const multiselectTagRemoveVariants = cva(
    'text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute -inset-y-px -end-px flex size-7 items-center justify-center rounded-e-md border border-transparent p-0 outline-hidden transition-[color,box-shadow] outline-none focus-visible:ring-[3px]'
)
export const multiselectInputVariants = cva(
    'placeholder:text-muted-foreground/70 flex-1 bg-transparent outline-hidden disabled:cursor-not-allowed'
)
export const multiselectClearButtonVariants = cva(
    'text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute end-0 top-0 flex size-9 items-center justify-center rounded-md border border-transparent transition-[color,box-shadow] outline-none focus-visible:ring-[3px]'
)
export const multiselectDropdownVariants = cva(
    'border-input absolute top-2 z-10 w-full overflow-hidden rounded-md border'
)
export const multiselectListVariants = cva('bg-popover text-popover-foreground shadow-lg outline-hidden')
export const multiselectEmptyVariants = cva('px-2 py-4 text-center text-sm')
export const multiselectGroupVariants = cva('h-full overflow-auto')

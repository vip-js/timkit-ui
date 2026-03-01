import { cva } from 'class-variance-authority'

export const stepperVariants = cva(
    'group/stepper inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col'
)
export const stepperItemVariants = cva(
    'group/step flex items-center group-data-[orientation=horizontal]/stepper:flex-row group-data-[orientation=vertical]/stepper:flex-col'
)
export const stepperTriggerVariants = cva(
    'focus-visible:border-ring focus-visible:ring-ring/50 inline-flex items-center gap-3 rounded-full outline-none focus-visible:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50'
)
export const stepperIndicatorVariants = cva(
    'bg-muted text-muted-foreground data-[state=active]:bg-primary data-[state=completed]:bg-primary data-[state=active]:text-primary-foreground data-[state=completed]:text-primary-foreground relative flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium'
)
export const stepperIndicatorLabelVariants = cva(
    'transition-all group-data-loading/step:scale-0 group-data-loading/step:opacity-0 group-data-loading/step:transition-none group-data-[state=completed]/step:scale-0 group-data-[state=completed]/step:opacity-0'
)
export const stepperIndicatorCheckVariants = cva(
    'absolute scale-0 opacity-0 transition-all group-data-[state=completed]/step:scale-100 group-data-[state=completed]/step:opacity-100'
)
export const stepperIndicatorLoaderVariants = cva('absolute transition-all')
export const stepperTitleVariants = cva('text-sm font-medium')
export const stepperDescriptionVariants = cva('text-muted-foreground text-sm')
export const stepperSeparatorVariants = cva(
    'bg-muted group-data-[state=completed]/step:bg-primary m-0.5 group-data-[orientation=horizontal]/stepper:h-0.5 group-data-[orientation=horizontal]/stepper:w-full group-data-[orientation=horizontal]/stepper:flex-1 group-data-[orientation=vertical]/stepper:h-12 group-data-[orientation=vertical]/stepper:w-0.5'
)

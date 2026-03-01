import { cva } from 'class-variance-authority'

export const calendarVariants = cva('p-3')
export const calendarRootVariants = cva('w-fit')
export const calendarMonthsVariants = cva('relative flex flex-col sm:flex-row gap-4')
export const calendarMonthVariants = cva('w-full')
export const calendarMonthCaptionVariants = cva(
    'relative mx-10 mb-1 flex h-9 items-center justify-center z-20'
)
export const calendarCaptionLabelVariants = cva('text-sm font-medium')
export const calendarNavVariants = cva('absolute top-0 flex w-full justify-between z-10')
export const calendarNavButtonVariants = cva('size-9 text-muted-foreground/80 hover:text-foreground p-0')
export const calendarWeekdayVariants = cva('size-9 p-0 text-xs font-medium text-muted-foreground/80')
export const calendarDayButtonVariants = cva(
    'relative flex size-9 items-center justify-center whitespace-nowrap rounded-md p-0 text-foreground group-[[data-selected]:not(.range-middle)]:[transition-property:color,background-color,border-radius,box-shadow] group-[[data-selected]:not(.range-middle)]:duration-150 group-data-disabled:pointer-events-none focus-visible:z-10 hover:not-in-data-selected:bg-accent group-data-selected:bg-primary hover:not-in-data-selected:text-foreground group-data-selected:text-primary-foreground group-data-disabled:text-foreground/30 group-data-disabled:line-through group-data-outside:text-foreground/30 group-data-selected:group-data-outside:text-primary-foreground outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] group-[.range-start:not(.range-end)]:rounded-e-none group-[.range-end:not(.range-start)]:rounded-s-none group-[.range-middle]:rounded-none group-[.range-middle]:group-data-selected:bg-accent group-[.range-middle]:group-data-selected:text-foreground'
)
export const calendarDayVariants = cva('group size-9 px-0 py-px text-sm')
export const calendarRangeStartVariants = cva('range-start')
export const calendarRangeEndVariants = cva('range-end')
export const calendarRangeMiddleVariants = cva('range-middle')
export const calendarTodayVariants = cva(
    '*:after:pointer-events-none *:after:absolute *:after:bottom-1 *:after:start-1/2 *:after:z-10 *:after:size-[3px] *:after:-translate-x-1/2 *:after:rounded-full *:after:bg-primary [&[data-selected]:not(.range-middle)>*]:after:bg-background [&[data-disabled]>*]:after:bg-foreground/30 *:after:transition-colors'
)
export const calendarOutsideVariants = cva(
    'text-muted-foreground data-selected:bg-accent/50 data-selected:text-muted-foreground'
)
export const calendarHiddenVariants = cva('invisible')
export const calendarWeekNumberVariants = cva('size-9 p-0 text-xs font-medium text-muted-foreground/80')
export const calendarGridVariants = cva('w-full border-collapse space-y-1')

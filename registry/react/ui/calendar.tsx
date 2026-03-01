'use client'

import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import { cva } from '../lib/cva'
import { cn } from '../lib/utils'
import { buttonVariants } from './button'

const calendarRootVariants = cva('w-fit')
const calendarMonthsVariants = cva('relative flex flex-col sm:flex-row gap-4')
const calendarMonthVariants = cva('w-full')
const calendarMonthCaptionVariants = cva(
    'relative mx-10 mb-1 flex h-9 items-center justify-center z-20'
)
const calendarCaptionLabelVariants = cva('text-sm font-medium')
const calendarNavVariants = cva('absolute top-0 flex w-full justify-between z-10')
const calendarNavButtonVariants = cva('size-9 text-muted-foreground/80 hover:text-foreground p-0')
const calendarWeekdayVariants = cva('size-9 p-0 text-xs font-medium text-muted-foreground/80')
const calendarDayButtonVariants = cva(
    'relative flex size-9 items-center justify-center whitespace-nowrap rounded-md p-0 text-foreground group-[[data-selected]:not(.range-middle)]:[transition-property:color,background-color,border-radius,box-shadow] group-[[data-selected]:not(.range-middle)]:duration-150 group-data-disabled:pointer-events-none focus-visible:z-10 hover:not-in-data-selected:bg-accent group-data-selected:bg-primary hover:not-in-data-selected:text-foreground group-data-selected:text-primary-foreground group-data-disabled:text-foreground/30 group-data-disabled:line-through group-data-outside:text-foreground/30 group-data-selected:group-data-outside:text-primary-foreground outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] group-[.range-start:not(.range-end)]:rounded-e-none group-[.range-end:not(.range-start)]:rounded-s-none group-[.range-middle]:rounded-none group-[.range-middle]:group-data-selected:bg-accent group-[.range-middle]:group-data-selected:text-foreground'
)
const calendarDayVariants = cva('group size-9 px-0 py-px text-sm')
const calendarRangeStartVariants = cva('range-start')
const calendarRangeEndVariants = cva('range-end')
const calendarRangeMiddleVariants = cva('range-middle')
const calendarTodayVariants = cva(
    '*:after:pointer-events-none *:after:absolute *:after:bottom-1 *:after:start-1/2 *:after:z-10 *:after:size-[3px] *:after:-translate-x-1/2 *:after:rounded-full *:after:bg-primary [&[data-selected]:not(.range-middle)>*]:after:bg-background [&[data-disabled]>*]:after:bg-foreground/30 *:after:transition-colors'
)
const calendarOutsideVariants = cva(
    'text-muted-foreground data-selected:bg-accent/50 data-selected:text-muted-foreground'
)
const calendarHiddenVariants = cva('invisible')
const calendarWeekNumberVariants = cva('size-9 p-0 text-xs font-medium text-muted-foreground/80')

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    components: userComponents,
    ...props
}: React.ComponentProps<typeof DayPicker>) {
    const defaultClassNames = {
        months: calendarMonthsVariants(),
        month: calendarMonthVariants(),
        month_caption: calendarMonthCaptionVariants(),
        caption_label: calendarCaptionLabelVariants(),
        nav: calendarNavVariants(),
        button_previous: cn(
            buttonVariants({ variant: 'ghost' }),
            calendarNavButtonVariants()
        ),
        button_next: cn(
            buttonVariants({ variant: 'ghost' }),
            calendarNavButtonVariants()
        ),
        weekday: calendarWeekdayVariants(),
        day_button: calendarDayButtonVariants(),
        day: calendarDayVariants(),
        range_start: calendarRangeStartVariants(),
        range_end: calendarRangeEndVariants(),
        range_middle: calendarRangeMiddleVariants(),
        today: calendarTodayVariants(),
        outside: calendarOutsideVariants(),
        hidden: calendarHiddenVariants(),
        week_number: calendarWeekNumberVariants(),
    }

    const mergedClassNames: typeof defaultClassNames = Object.keys(defaultClassNames).reduce(
        (acc, key) => ({
            ...acc,
            [key]: classNames?.[key as keyof typeof classNames]
                ? cn(
                    defaultClassNames[key as keyof typeof defaultClassNames],
                    classNames[key as keyof typeof classNames]
                )
                : defaultClassNames[key as keyof typeof defaultClassNames],
        }),
        {} as typeof defaultClassNames
    )

    const defaultComponents = {
        Chevron: (props: {
            className?: string
            size?: number
            disabled?: boolean
            orientation?: 'left' | 'right' | 'up' | 'down'
        }) => {
            if (props.orientation === 'left') {
                return (
                    <svg
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                )
            }
            return (
                <svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="m9 18 6-6-6-6" />
                </svg>
            )
        },
    } as any

    const mergedComponents = {
        ...defaultComponents,
        ...userComponents,
    }

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            data-slot="calendar"
            className={cn(calendarRootVariants(), className)}
            classNames={mergedClassNames}
            components={mergedComponents}
            {...props}
        />
    )
}

export { Calendar }

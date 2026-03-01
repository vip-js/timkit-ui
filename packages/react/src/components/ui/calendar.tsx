'use client'

import * as React from 'react'
import {
  calendarCaptionLabelVariants,
  calendarDayButtonVariants,
  calendarDayVariants,
  calendarHiddenVariants,
  calendarMonthCaptionVariants,
  calendarMonthVariants,
  calendarMonthsVariants,
  calendarNavButtonVariants,
  calendarNavVariants,
  calendarOutsideVariants,
  calendarRangeEndVariants,
  calendarRangeMiddleVariants,
  calendarRangeStartVariants,
  calendarRootVariants,
  calendarTodayVariants,
  calendarWeekNumberVariants,
  calendarWeekdayVariants,
  cn,
} from '@timui/core'
import { DayPicker } from 'react-day-picker'

import { buttonVariants } from './button'

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
  }

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

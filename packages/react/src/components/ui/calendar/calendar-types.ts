import type * as React from 'react'

export type CalendarMode = 'single' | 'range' | 'multiple'
export type CalendarRangeValue = { from: Date | undefined; to?: Date }
export type DisabledMatcher =
  | Date
  | {
      before?: Date
      after?: Date
      from?: Date
      to?: Date
      dayOfWeek?: number[]
    }
  | ((date: Date) => boolean)

export type CalendarDropdownOption = {
  value: string | number
  label: string
  disabled?: boolean
}

export type CalendarDropdownProps = {
  value?: string | number
  options?: CalendarDropdownOption[]
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}

export type CalendarWeekNumberProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
  week: { weekNumber: number }
}

export type CalendarDayButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  day: { date: Date }
  modifiers: Record<string, boolean>
  children?: React.ReactNode
}

export type CalendarComponents = {
  Chevron?: React.ComponentType<{
    className?: string
    size?: number
    disabled?: boolean
    orientation?: 'left' | 'right' | 'up' | 'down'
  }>
  DayButton?: React.ComponentType<CalendarDayButtonProps>
  WeekNumber?: React.ComponentType<CalendarWeekNumberProps>
  CaptionLabel?: React.ComponentType<React.HTMLAttributes<HTMLElement>>
  MonthGrid?: React.ComponentType<React.TableHTMLAttributes<HTMLTableElement>>
  DropdownNav?: React.ComponentType<{ children?: React.ReactNode }>
  Dropdown?: React.ComponentType<CalendarDropdownProps>
  YearsDropdown?: React.ComponentType<CalendarDropdownProps>
  MonthsDropdown?: React.ComponentType<CalendarDropdownProps>
}

export type CalendarClassNames = Partial<
  Record<
    | 'months'
    | 'month'
    | 'month_caption'
    | 'caption_label'
    | 'nav'
    | 'button_previous'
    | 'button_next'
    | 'weekday'
    | 'day_button'
    | 'day'
    | 'range_start'
    | 'range_end'
    | 'range_middle'
    | 'today'
    | 'outside'
    | 'hidden'
    | 'week_number',
    string
  >
>

export type CalendarSelectedValue = Date | Date[] | CalendarRangeValue | undefined

export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  mode?: CalendarMode
  selected?: CalendarSelectedValue
  onSelect?: (value: CalendarSelectedValue) => void
  month?: Date
  onMonthChange?: (month: Date) => void
  defaultMonth?: Date
  startMonth?: Date
  endMonth?: Date
  showOutsideDays?: boolean
  numberOfMonths?: number
  pagedNavigation?: boolean
  captionLayout?: 'label' | 'dropdown' | 'dropdown-years'
  hideNavigation?: boolean
  fixedWeeks?: boolean
  showWeekNumber?: boolean
  disabled?: DisabledMatcher | DisabledMatcher[]
  excludeDisabled?: boolean
  classNames?: CalendarClassNames
  components?: CalendarComponents
}

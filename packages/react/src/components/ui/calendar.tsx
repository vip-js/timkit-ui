'use client'

import * as React from 'react'
import { getLocalTimeZone } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
import {
  calendarCaptionLabelVariants,
  calendarDayButtonVariants,
  calendarDayVariants,
  calendarGridVariants,
  calendarHiddenVariants,
  calendarMonthCaptionVariants,
  calendarMonthsVariants,
  calendarMonthVariants,
  calendarNavButtonVariants,
  calendarNavVariants,
  calendarOutsideVariants,
  calendarRangeEndVariants,
  calendarRangeMiddleVariants,
  calendarRangeStartVariants,
  calendarRootVariants,
  calendarTodayVariants,
  calendarWeekdayVariants,
  calendarWeekNumberVariants,
  calendarConnect,
  calendarMachine,
  cn,
} from '@timui/core'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'

import { buttonVariants } from './button'
import type {
  CalendarClassNames,
  CalendarComponents,
  CalendarDayButtonProps,
  CalendarDropdownOption,
  CalendarDropdownProps,
  CalendarMode,
  CalendarProps,
  CalendarSelectedValue,
  CalendarWeekNumberProps,
} from './calendar/calendar-types'
import {
  addMonths,
  clampMonth,
  compareMonth,
  dateFromSelected,
  getIsoWeekNumber,
  hasUnavailableBetween,
  matchDisabled,
  selectedToDateValues,
  toDateValue,
  toMonthEnd,
  toMonthStart,
  valuesToSelected,
} from './calendar/calendar-utils'

function Calendar({
  className,
  classNames,
  components: userComponents,
  mode = 'single',
  selected,
  onSelect,
  month,
  onMonthChange,
  defaultMonth,
  startMonth,
  endMonth,
  showOutsideDays = true,
  numberOfMonths = 1,
  pagedNavigation = false,
  captionLayout = 'label',
  hideNavigation = false,
  fixedWeeks = false,
  showWeekNumber = false,
  disabled,
  excludeDisabled = false,
  ...props
}: CalendarProps) {
  const timeZone = React.useMemo(() => getLocalTimeZone(), [])
  const generatedId = React.useId()
  const disabledMatchers = React.useMemo(
    () => (disabled === undefined ? [] : Array.isArray(disabled) ? disabled : [disabled]),
    [disabled]
  )

  const minMonth = React.useMemo(() => (startMonth ? toMonthStart(startMonth) : undefined), [startMonth])
  const maxMonth = React.useMemo(() => {
    if (!endMonth) return undefined
    return addMonths(toMonthStart(endMonth), -(numberOfMonths - 1))
  }, [endMonth, numberOfMonths])

  const initialMonth = React.useMemo(() => {
    const base = month ?? defaultMonth ?? dateFromSelected(selected, mode) ?? new Date()
    return clampMonth(toMonthStart(base), minMonth, maxMonth)
  }, [month, defaultMonth, selected, mode, minMonth, maxMonth])

  const [uncontrolledMonth, setUncontrolledMonth] = React.useState(initialMonth)
  const viewMonth = React.useMemo(
    () => (month ? clampMonth(toMonthStart(month), minMonth, maxMonth) : uncontrolledMonth),
    [month, minMonth, maxMonth, uncontrolledMonth]
  )
  const focusedValue = React.useMemo(
    () => (month ? toDateValue(viewMonth) : undefined),
    [month, viewMonth]
  )
  const defaultFocusedValue = React.useMemo(
    () => (month ? undefined : toDateValue(initialMonth)),
    [initialMonth, month]
  )

  React.useEffect(() => {
    if (!month) return
    setUncontrolledMonth(clampMonth(toMonthStart(month), minMonth, maxMonth))
  }, [month, minMonth, maxMonth])

  const selectedValues = React.useMemo(() => selectedToDateValues(selected, mode), [selected, mode])

  const handleUnavailable = React.useCallback(
    (value: DateValue) => {
      const date = value.toDate(timeZone)
      return disabledMatchers.some((matcher) => matchDisabled(date, matcher))
    },
    [disabledMatchers, timeZone]
  )

  const lastVisibleMonthRef = React.useRef<string>('')

  const service = useMachine(calendarMachine, {
    id: generatedId,
    inline: true,
    selectionMode: mode,
    numOfMonths: numberOfMonths,
    outsideDaySelectable: showOutsideDays,
    fixedWeeks,
    min: startMonth ? toDateValue(toMonthStart(startMonth)) : undefined,
    max: endMonth ? toDateValue(toMonthEnd(endMonth)) : undefined,
    focusedValue,
    defaultFocusedValue,
    timeZone,
    value: selected === undefined ? undefined : selectedValues,
    isDateUnavailable: disabledMatchers.length > 0 ? handleUnavailable : undefined,
    onValueChange(details) {
      const rawNext = valuesToSelected(details.value, mode, timeZone)
      if (
        excludeDisabled &&
        mode === 'range' &&
        rawNext &&
        !Array.isArray(rawNext) &&
        !(rawNext instanceof Date) &&
        rawNext.from &&
        rawNext.to
      ) {
        const hasUnavailable = hasUnavailableBetween(rawNext.from, rawNext.to, (date) =>
          disabledMatchers.some((matcher) => matchDisabled(date, matcher))
        )
        if (hasUnavailable) {
          onSelect?.({ from: rawNext.to, to: undefined })
          return
        }
      }
      onSelect?.(rawNext)
    },
    onVisibleRangeChange(details) {
      const nextMonth = toMonthStart(details.visibleRange.start.toDate(timeZone))
      const nextKey = `${nextMonth.getFullYear()}-${nextMonth.getMonth()}`
      if (nextKey === lastVisibleMonthRef.current) return
      lastVisibleMonthRef.current = nextKey
      if (!month) {
        setUncontrolledMonth(nextMonth)
      }
      onMonthChange?.(nextMonth)
    },
  })

  const api = React.useMemo(() => calendarConnect(service, normalizeProps), [service])

  const setCalendarMonth = React.useCallback(
    (next: Date) => {
      const clamped = clampMonth(toMonthStart(next), minMonth, maxMonth)
      const key = `${clamped.getFullYear()}-${clamped.getMonth()}`
      if (key === `${viewMonth.getFullYear()}-${viewMonth.getMonth()}`) return
      if (!month) {
        setUncontrolledMonth(clamped)
      }
      onMonthChange?.(clamped)
    },
    [minMonth, maxMonth, viewMonth, month, onMonthChange]
  )

  const canGoPrev = minMonth ? compareMonth(viewMonth, minMonth) > 0 : true
  const canGoNext = maxMonth ? compareMonth(viewMonth, maxMonth) < 0 : true
  const navStep = pagedNavigation ? numberOfMonths : 1

  const defaultClassNames = {
    months: calendarMonthsVariants(),
    month: calendarMonthVariants(),
    month_caption: calendarMonthCaptionVariants(),
    caption_label: calendarCaptionLabelVariants(),
    nav: calendarNavVariants(),
    button_previous: cn(buttonVariants({ variant: 'ghost' }), calendarNavButtonVariants()),
    button_next: cn(buttonVariants({ variant: 'ghost' }), calendarNavButtonVariants()),
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

  const rootProps = api.getRootProps()
  const mergedRootProps = mergeProps(rootProps, props) as React.HTMLAttributes<HTMLDivElement>
  const { className: rootClassName, ...rootRest } = mergedRootProps as {
    className?: string
  }

  const ChevronComponent = userComponents?.Chevron
  const CaptionLabelComponent = userComponents?.CaptionLabel
  const MonthGridComponent = userComponents?.MonthGrid
  const DayButtonComponent = userComponents?.DayButton
  const WeekNumberComponent = userComponents?.WeekNumber
  const DropdownNavComponent = userComponents?.DropdownNav
  const MonthDropdownComponent = userComponents?.MonthsDropdown ?? userComponents?.Dropdown
  const YearDropdownComponent = userComponents?.YearsDropdown ?? userComponents?.Dropdown

  const renderChevron = (orientation: 'left' | 'right') => {
    if (ChevronComponent) {
      return <ChevronComponent orientation={orientation} />
    }
    if (orientation === 'left') {
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
  }

  const renderDropdown = (
    dropdownProps: React.SelectHTMLAttributes<HTMLSelectElement>,
    options: CalendarDropdownOption[],
    customDropdown?: React.ComponentType<CalendarDropdownProps>
  ) => {
    if (customDropdown) {
      const DropdownComponent = customDropdown
      return (
        <DropdownComponent
          value={dropdownProps.value as string | number | undefined}
          options={options}
          onChange={dropdownProps.onChange as React.ChangeEventHandler<HTMLSelectElement> | undefined}
        />
      )
    }
    return (
      <select {...dropdownProps} className={cn('h-8 rounded-md border px-2 text-sm', dropdownProps.className)}>
        {options.map((option) => (
          <option key={option.value} value={String(option.value)} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }

  const monthSelectProps = api.getMonthSelectProps()
  const yearSelectProps = api.getYearSelectProps()
  const monthOptions = api.getMonths({ format: 'long' }).map((item) => ({
    value: item.value,
    label: item.label,
    disabled: item.disabled,
  }))
  const yearOptions = api.getYears().map((item) => ({
    value: item.value,
    label: item.label,
    disabled: item.disabled,
  }))

  const showDropdownCaption = captionLayout === 'dropdown' || captionLayout === 'dropdown-years'
  const currentMonthLabel = api.format(toDateValue(viewMonth), { month: 'long', year: 'numeric' })

  const renderCaptionContent = () => {
    if (showDropdownCaption) {
      const monthControl =
        captionLayout === 'dropdown' ? (
          <span>
            {renderDropdown(monthSelectProps, monthOptions, MonthDropdownComponent)}
          </span>
        ) : (
          <span className={mergedClassNames.caption_label}>
            {api.format(toDateValue(viewMonth), { month: 'long' })}
          </span>
        )

      const yearControl = (
        <span>{renderDropdown(yearSelectProps, yearOptions, YearDropdownComponent)}</span>
      )

      const controls = (
        <>
          {monthControl}
          {yearControl}
        </>
      )

      if (DropdownNavComponent) {
        return <DropdownNavComponent>{controls}</DropdownNavComponent>
      }
      return <div className="flex items-center gap-2">{controls}</div>
    }

    if (CaptionLabelComponent) {
      return <CaptionLabelComponent className={mergedClassNames.caption_label}>{currentMonthLabel}</CaptionLabelComponent>
    }

    return <div className={mergedClassNames.caption_label}>{currentMonthLabel}</div>
  }

  const monthData = React.useMemo(() => {
    const count = Math.max(1, numberOfMonths)
    const start = api.visibleRange?.start
    if (!start) return []

    return Array.from({ length: count }, (_, index) => {
      const monthStart = start.add({ months: index })
      const id = `month-${index}`
      const visibleRange = {
        start: monthStart,
        end: monthStart.add({ months: 1 }).subtract({ days: 1 }),
      }

      const weeks = api.getMonthWeeks(monthStart).map((week) => {
        const weekNumber = getIsoWeekNumber(week[0].toDate(timeZone))
        const days = week.map((dayValue) => {
          const state = api.getDayTableCellState({ value: dayValue, visibleRange })
          const cellProps = api.getDayTableCellProps({ value: dayValue, visibleRange })
          const triggerProps = api.getDayTableCellTriggerProps({ value: dayValue, visibleRange })
          const dayDate = dayValue.toDate(timeZone)
          const rangeMiddle = state.inRange && !state.firstInRange && !state.lastInRange
          const hidden = !showOutsideDays && state.outsideRange

          return {
            key: dayValue.toString(),
            label: dayValue.day,
            dayDate,
            state,
            cellProps,
            triggerProps,
            className: cn(
              mergedClassNames.day,
              state.outsideRange && mergedClassNames.outside,
              hidden && mergedClassNames.hidden,
              state.firstInRange && mergedClassNames.range_start,
              state.lastInRange && mergedClassNames.range_end,
              rangeMiddle && mergedClassNames.range_middle,
              state.today && mergedClassNames.today
            ),
            modifiers: {
              selected: state.selected,
              disabled: !state.selectable || state.unavailable,
              outside: state.outsideRange,
              today: state.today,
              range_start: state.firstInRange,
              range_end: state.lastInRange,
              range_middle: rangeMiddle,
            },
          }
        })

        return { key: `${id}-${week[0].toString()}`, weekNumber, days }
      })

      return {
        id,
        label: api.format(monthStart, { month: 'long', year: 'numeric' }),
        tableProps: api.getTableProps({ view: 'day', id }),
        tableHeadProps: api.getTableHeadProps({ view: 'day', id }),
        tableBodyProps: api.getTableBodyProps({ view: 'day', id }),
        tableRowProps: api.getTableRowProps({ view: 'day', id }),
        tableHeaderProps: api.getTableHeaderProps({ view: 'day', id }),
        weeks,
      }
    })
  }, [api, numberOfMonths, mergedClassNames, showOutsideDays, timeZone])

  const defaultComponents = {
    DayButton: (buttonProps: CalendarDayButtonProps) => <button {...buttonProps} />,
    WeekNumber: ({ week, ...weekProps }: CalendarWeekNumberProps) => <th {...weekProps}>{week.weekNumber}</th>,
    MonthGrid: (tableProps: React.TableHTMLAttributes<HTMLTableElement>) => <table {...tableProps} />,
    CaptionLabel: (captionProps: React.HTMLAttributes<HTMLElement>) => <div {...captionProps} />,
  }

  const mergedComponents = {
    ...defaultComponents,
    ...userComponents,
  }

  const prevTriggerProps = api.getPrevTriggerProps({ view: 'day' })
  const nextTriggerProps = api.getNextTriggerProps({ view: 'day' })

  return (
    <div
      {...(rootRest as React.HTMLAttributes<HTMLDivElement>)}
      data-slot="calendar"
      className={cn(calendarRootVariants(), rootClassName, className)}
    >
      <div className={mergedClassNames.months}>
        {monthData.map((monthItem, monthIndex) => {
          const MonthGrid = mergedComponents.MonthGrid
          const DayButton = mergedComponents.DayButton
          const WeekNumber = mergedComponents.WeekNumber
          const renderTable = (
            <>
              <thead {...monthItem.tableHeadProps}>
                <tr {...monthItem.tableRowProps}>
                  {showWeekNumber ? (
                    <th className={mergedClassNames.week_number} aria-hidden="true">
                      #
                    </th>
                  ) : null}
                  {api.weekDays.map((day) => (
                    <th key={`${monthItem.id}-${day.short}`} {...monthItem.tableHeaderProps} className={mergedClassNames.weekday}>
                      {day.short}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody {...monthItem.tableBodyProps}>
                {monthItem.weeks.map((week) => (
                  <tr key={week.key} {...monthItem.tableRowProps}>
                    {showWeekNumber ? (
                      <WeekNumber className={mergedClassNames.week_number} week={{ weekNumber: week.weekNumber }} />
                    ) : null}
                    {week.days.map((dayCell) => {
                      const triggerClassName = (dayCell.triggerProps as { className?: string }).className
                      const buttonProps = {
                        ...(dayCell.triggerProps as React.ButtonHTMLAttributes<HTMLButtonElement>),
                        className: cn(mergedClassNames.day_button, triggerClassName),
                      }

                      return (
                        <td
                          key={dayCell.key}
                          {...(dayCell.cellProps as React.TdHTMLAttributes<HTMLTableCellElement>)}
                          className={cn(
                            dayCell.className,
                            (dayCell.cellProps as { className?: string }).className
                          )}
                        >
                          <DayButton
                            {...buttonProps}
                            day={{ date: dayCell.dayDate }}
                            modifiers={dayCell.modifiers}
                          >
                            {dayCell.label}
                          </DayButton>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </>
          )

          return (
            <div key={monthItem.id} className={mergedClassNames.month}>
              <div className={mergedClassNames.month_caption}>
                {monthIndex === 0 ? renderCaptionContent() : (
                  <div className={mergedClassNames.caption_label}>{monthItem.label}</div>
                )}
                {monthIndex === 0 && !hideNavigation ? (
                  <div className={mergedClassNames.nav}>
                    <button
                      {...(prevTriggerProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
                      type="button"
                      className={cn(mergedClassNames.button_previous, prevTriggerProps.className)}
                      disabled={!canGoPrev}
                      onClick={(event) => {
                        event.preventDefault()
                        if (!canGoPrev) return
                        setCalendarMonth(addMonths(viewMonth, -navStep))
                      }}
                    >
                      {renderChevron('left')}
                    </button>
                    <button
                      {...(nextTriggerProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
                      type="button"
                      className={cn(mergedClassNames.button_next, nextTriggerProps.className)}
                      disabled={!canGoNext}
                      onClick={(event) => {
                        event.preventDefault()
                        if (!canGoNext) return
                        setCalendarMonth(addMonths(viewMonth, navStep))
                      }}
                    >
                      {renderChevron('right')}
                    </button>
                  </div>
                ) : null}
              </div>
              <MonthGrid
                {...(monthItem.tableProps as React.TableHTMLAttributes<HTMLTableElement>)}
                className={cn(
                  calendarGridVariants(),
                  (monthItem.tableProps as { className?: string }).className
                )}
              >
                {renderTable}
              </MonthGrid>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { Calendar }
export type {
  CalendarClassNames,
  CalendarComponents,
  CalendarDayButtonProps,
  CalendarDropdownProps,
  CalendarMode,
  CalendarProps,
  CalendarRangeValue,
  CalendarSelectedValue,
  CalendarWeekNumberProps,
  DisabledMatcher,
} from './calendar/calendar-types'

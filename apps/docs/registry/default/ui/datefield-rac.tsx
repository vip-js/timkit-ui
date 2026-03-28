'use client'

import * as React from 'react'
import { cn, dateFieldInputVariants, dateFieldSegmentVariants } from '@timui/core'

type DateInputType = 'date' | 'time' | 'datetime-local'
type DateGranularity = 'day' | 'minute' | 'second'

type DateFieldContextValue = {
  inputType: DateInputType
  granularity?: DateGranularity
}

const DateFieldContext = React.createContext<DateFieldContextValue | null>(null)

const dateInputStyle = dateFieldInputVariants()

type DateFieldProps<T = unknown> = React.HTMLAttributes<HTMLDivElement> & {
  type?: DateInputType
  granularity?: DateGranularity
  hourCycle?: 12 | 24
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
}

type TimeFieldProps<T = unknown> = React.HTMLAttributes<HTMLDivElement> & {
  type?: DateInputType
  granularity?: DateGranularity
  hourCycle?: 12 | 24
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
}

type DateSegmentProps = React.HTMLAttributes<HTMLSpanElement>

interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  unstyled?: boolean
  invalid?: boolean
}

function DateField<T = unknown>({
  type,
  granularity,
  className,
  children,
  ...props
}: DateFieldProps<T>) {
  const inputType: DateInputType =
    type ?? (granularity && granularity !== 'day' ? 'datetime-local' : 'date')

  return (
    <DateFieldContext.Provider value={{ inputType, granularity }}>
      <div className={cn(className)} {...props}>
        {children}
      </div>
    </DateFieldContext.Provider>
  )
}

function TimeField<T = unknown>({
  type,
  granularity,
  className,
  children,
  ...props
}: TimeFieldProps<T>) {
  const inputType: DateInputType = type ?? 'time'

  return (
    <DateFieldContext.Provider value={{ inputType, granularity }}>
      <div className={cn(className)} {...props}>
        {children}
      </div>
    </DateFieldContext.Provider>
  )
}

function DateSegment({ className, ...props }: DateSegmentProps) {
  return <span className={cn(dateFieldSegmentVariants(), className)} {...props} />
}

function DateInput({ className, unstyled = false, invalid, type, step, ...props }: DateInputProps) {
  const context = React.useContext(DateFieldContext)
  const resolvedType = type ?? context?.inputType ?? 'date'

  const resolvedStep =
    step ??
    (context?.granularity === 'second' ? 1 : context?.granularity === 'minute' ? 60 : undefined)

  return (
    <input
      type={resolvedType}
      step={resolvedStep}
      className={cn(!unstyled && dateFieldInputVariants(), className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
}

export { DateField, DateInput, DateSegment, TimeField, dateInputStyle }
export type { DateFieldProps, DateInputProps, DateSegmentProps, TimeFieldProps }

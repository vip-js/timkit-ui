'use client'

import * as React from 'react'
import { cn, dateFieldInputVariants, dateFieldSegmentVariants } from '@timui/core'

type DateInputType = 'date' | 'time' | 'datetime-local'
type DateGranularity = 'day' | 'minute' | 'second'
type DateFieldValue = string | number | Date | null

type DateFieldContextValue = {
  inputType: DateInputType
  granularity?: DateGranularity
  value?: string
  onValueChange?: (value: string) => void
}

const DateFieldContext = React.createContext<DateFieldContextValue | null>(null)

const dateInputStyle = dateFieldInputVariants()

type DateFieldProps<T = DateFieldValue> = React.HTMLAttributes<HTMLDivElement> & {
  type?: DateInputType
  granularity?: DateGranularity
  hourCycle?: 12 | 24
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
}

type TimeFieldProps<T = DateFieldValue> = React.HTMLAttributes<HTMLDivElement> & {
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

const toInputString = (value?: DateFieldValue) => {
  if (value === undefined || value === null) return undefined
  if (value instanceof Date) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(
      value.getDate()
    ).padStart(2, '0')}`
  }
  return String(value)
}

function DateField<T = DateFieldValue>({
  type,
  granularity,
  value,
  defaultValue,
  onChange,
  hourCycle: _hourCycle,
  className,
  children,
  ...restProps
}: DateFieldProps<T>) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | undefined>(() =>
    toInputString(defaultValue as DateFieldValue)
  )
  const controlledValue = value !== undefined ? toInputString(value as DateFieldValue) : undefined
  const fieldValue = controlledValue ?? uncontrolledValue

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setUncontrolledValue(nextValue)
      }
      onChange?.(nextValue as T)
    },
    [onChange, value]
  )

  const inputType: DateInputType =
    type ?? (granularity && granularity !== 'day' ? 'datetime-local' : 'date')

  return (
    <DateFieldContext.Provider
      value={{ inputType, granularity, value: fieldValue, onValueChange: handleValueChange }}
    >
      <div className={cn(className)} {...restProps}>
        {children}
      </div>
    </DateFieldContext.Provider>
  )
}

function TimeField<T = DateFieldValue>({
  type,
  granularity,
  value,
  defaultValue,
  onChange,
  hourCycle: _hourCycle,
  className,
  children,
  ...restProps
}: TimeFieldProps<T>) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | undefined>(() =>
    toInputString(defaultValue as DateFieldValue)
  )
  const controlledValue = value !== undefined ? toInputString(value as DateFieldValue) : undefined
  const fieldValue = controlledValue ?? uncontrolledValue

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setUncontrolledValue(nextValue)
      }
      onChange?.(nextValue as T)
    },
    [onChange, value]
  )

  const inputType: DateInputType = type ?? 'time'

  return (
    <DateFieldContext.Provider
      value={{ inputType, granularity, value: fieldValue, onValueChange: handleValueChange }}
    >
      <div className={cn(className)} {...restProps}>
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
  const { onChange, value, defaultValue, ...restProps } = props
  const resolvedType = type ?? context?.inputType ?? 'date'
  const resolvedValue = value ?? context?.value

  const resolvedStep =
    step ??
    (context?.granularity === 'second' ? 1 : context?.granularity === 'minute' ? 60 : undefined)

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      context?.onValueChange?.(event.currentTarget.value)
      onChange?.(event)
    },
    [context, onChange]
  )

  return (
    <input
      type={resolvedType}
      step={resolvedStep}
      value={resolvedValue}
      defaultValue={resolvedValue === undefined ? defaultValue : undefined}
      className={cn(!unstyled && dateFieldInputVariants(), className)}
      aria-invalid={invalid || undefined}
      onChange={handleChange}
      {...restProps}
    />
  )
}

export { DateField, DateInput, DateSegment, TimeField, dateInputStyle }
export type { DateFieldProps, DateInputProps, DateSegmentProps, TimeFieldProps }

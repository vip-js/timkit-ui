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
  disabled?: boolean
  readOnly?: boolean
  min?: string
  max?: string
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
  disabled?: boolean
  readOnly?: boolean
  min?: string
  max?: string
  onChange?: (value: T) => void
  onValueChange?: (value: string) => void
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

const dayStamp = (raw?: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw || '')
  if (!match) return undefined
  return Number(match[1]) * 10000 + Number(match[2]) * 100 + Number(match[3])
}

const outsideRange = (value: string, min?: string, max?: string) => {
  const day = dayStamp(value)
  if (day == null) return false
  const low = dayStamp(min)
  const high = dayStamp(max)
  return (low != null && day < low) || (high != null && day > high)
}

const toInputString = (value?: DateFieldValue) => {
  if (value === undefined) return undefined
  if (value === null) return ''
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
  disabled,
  readOnly,
  min,
  max,
  onChange,
  onValueChange,
  hourCycle: _hourCycle,
  className,
  children,
  ...restProps
}: DateFieldProps<T>) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | undefined>(() =>
    toInputString(defaultValue as DateFieldValue)
  )
  const controlledValue = value !== undefined ? toInputString(value as DateFieldValue) : undefined
  const fieldValue = controlledValue ?? uncontrolledValue ?? ''

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      if (disabled || readOnly || outsideRange(nextValue, min, max)) return
      if (value === undefined) {
        setUncontrolledValue(nextValue)
      }
      onValueChange?.(nextValue)
      onChange?.(nextValue as T)
    },
    [disabled, max, min, onChange, onValueChange, readOnly, value]
  )

  const inputType: DateInputType =
    type ?? (granularity && granularity !== 'day' ? 'datetime-local' : 'date')

  return (
    <DateFieldContext.Provider
      value={{
        inputType,
        granularity,
        value: fieldValue,
        disabled,
        readOnly,
        min,
        max,
        onValueChange: handleValueChange,
      }}
    >
      <div className={cn(className)} {...restProps} data-slot="date-field">
        {/^\d{4}-\d{2}-\d{2}$/.test(fieldValue) ? <p role="status">{fieldValue}</p> : null}
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
      <div className={cn(className)} {...restProps} data-slot="date-field">
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
  const resolvedValue = value !== undefined ? (value ?? '') : context?.value

  const resolvedStep =
    step ??
    (context?.granularity === 'second' ? 1 : context?.granularity === 'minute' ? 60 : undefined)

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (
        context?.disabled ||
        props.disabled ||
        context?.readOnly ||
        props.readOnly ||
        outsideRange(event.currentTarget.value, context?.min, context?.max)
      ) {
        event.currentTarget.value = String(resolvedValue ?? '')
        return
      }
      context?.onValueChange?.(event.currentTarget.value)
      onChange?.(event)
    },
    [context, onChange, props.disabled, props.readOnly, resolvedValue]
  )

  return (
    <input
      type={resolvedType}
      step={resolvedStep}
      value={resolvedValue}
      defaultValue={resolvedValue === undefined ? defaultValue : undefined}
      className={cn(!unstyled && dateFieldInputVariants(), className)}
      aria-invalid={invalid || undefined}
      {...restProps}
      min={context?.min || undefined}
      max={context?.max || undefined}
      disabled={props.disabled || context?.disabled || undefined}
      readOnly={props.readOnly || context?.readOnly || undefined}
      aria-readonly={props.readOnly || context?.readOnly || undefined}
      onChange={handleChange}
    />
  )
}

export { DateField, DateInput, DateSegment, TimeField, dateInputStyle }
export type { DateFieldProps, DateInputProps, DateSegmentProps, TimeFieldProps }

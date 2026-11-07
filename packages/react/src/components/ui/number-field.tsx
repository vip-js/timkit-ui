'use client'

import * as React from 'react'
import {
  cn,
  numberFieldConnect,
  numberFieldMachine,
  type NumberFieldApi,
  type NumberFieldFocusChangeDetails,
  type NumberFieldInputMode,
  type NumberFieldIntlTranslations,
  type NumberFieldMachine,
  type NumberFieldValueChangeDetails,
  type NumberFieldValueInvalidDetails,
} from '@timui/core'
import type { Machine as ZagMachine, MachineSchema as ZagMachineSchema } from '@zag-js/core'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'

import { Slot } from './slot'

type NumberFieldProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange' | 'value'
> & {
  id?: string
  value?: number | string
  defaultValue?: number | string
  min?: number
  max?: number
  minValue?: number | string
  maxValue?: number | string
  step?: number
  formatOptions?: Intl.NumberFormatOptions
  inputMode?: NumberFieldInputMode
  allowMouseWheel?: boolean
  allowOverflow?: boolean
  clampValueOnBlur?: boolean
  focusInputOnChange?: boolean
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
  name?: string
  form?: string
  dir?: 'ltr' | 'rtl'
  locale?: string
  translations?: NumberFieldIntlTranslations
  spinOnPress?: boolean
  onValueChange?: (value?: number) => void
  onChange?: (value?: number) => void
  onValueInvalid?: (details: NumberFieldValueInvalidDetails) => void
  onFocusChange?: (details: NumberFieldFocusChangeDetails) => void
  onValueCommit?: (details: NumberFieldValueChangeDetails) => void
}

const NumberFieldContext = React.createContext<NumberFieldApi | null>(null)

type InferMachineSchema<T> = T extends ZagMachine<infer S> ? S : ZagMachineSchema
type NumberFieldSchema = InferMachineSchema<NumberFieldMachine>

const useNumberFieldContext = () => {
  const context = React.useContext(NumberFieldContext)
  if (!context) {
    throw new Error('NumberField subcomponents must be used within <NumberField>')
  }
  return context
}

const toNumber = (value?: number | string) => {
  if (value === undefined || value === null || value === '') return undefined
  const num = typeof value === 'string' ? Number(value) : value
  return Number.isFinite(num) ? num : undefined
}

const toStringValue = (value?: number | string) => {
  if (value === undefined || value === null || value === '') return undefined
  return String(value)
}

const NumberField = React.forwardRef<HTMLDivElement, NumberFieldProps>(
  (
    {
      className,
      id,
      value,
      defaultValue,
      min,
      max,
      minValue,
      maxValue,
      step = 1,
      formatOptions,
      inputMode,
      allowMouseWheel,
      allowOverflow,
      clampValueOnBlur,
      focusInputOnChange,
      disabled,
      readOnly,
      required,
      invalid,
      name,
      form,
      dir,
      locale,
      translations,
      spinOnPress,
      onValueChange,
      onChange,
      onValueInvalid,
      onFocusChange,
      onValueCommit,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const resolvedMin = min ?? toNumber(minValue)
    const resolvedMax = max ?? toNumber(maxValue)
    const controlled = value !== undefined
    const controlledValue = !controlled ? undefined : value == null || value === '' ? '' : String(value)
    const uncontrolledDefaultValue = controlled ? undefined : toStringValue(defaultValue)

    const service = useMachine<NumberFieldSchema>(numberFieldMachine, {
      id: id ?? generatedId,
      value: controlledValue,
      defaultValue: uncontrolledDefaultValue,
      min: resolvedMin,
      max: resolvedMax,
      step,
      formatOptions,
      inputMode,
      allowMouseWheel,
      allowOverflow,
      clampValueOnBlur,
      focusInputOnChange,
      disabled,
      readOnly,
      required,
      invalid,
      name,
      form,
      dir,
      locale,
      translations,
      spinOnPress,
      onValueInvalid,
      onFocusChange,
      onValueCommit,
      onValueChange(details: NumberFieldValueChangeDetails) {
        const next = Number.isFinite(details.valueAsNumber) ? details.valueAsNumber : undefined
        onValueChange?.(next)
        onChange?.(next)
      },
    })

    const api = numberFieldConnect(service, normalizeProps)
    const emitted = React.useRef('')
    React.useLayoutEffect(() => {
      const raw = api.value
      const current = Number(raw)
      if (raw === '' || raw == null || !Number.isFinite(current)) return
      let next = current
      if (resolvedMin != null) next = Math.max(resolvedMin, next)
      if (resolvedMax != null) next = Math.min(resolvedMax, next)
      if (next === current) return
      if (controlled) {
        const signature = String(next)
        if (emitted.current === signature) return
        emitted.current = signature
        onValueChange?.(next)
        onChange?.(next)
        return
      }
      api.setValue(next)
    })
    const rootProps = api.getRootProps()
    const mergedProps = mergeProps(rootProps, props) as React.HTMLAttributes<HTMLDivElement>
    const { className: mergedClassName, children, ...restProps } = mergedProps
    const raw = api.value
    const numeric = Number(raw)
    const valueStatus = raw === '' || raw == null || !Number.isFinite(numeric) ? '' : String(numeric)

    return (
      <NumberFieldContext.Provider value={api}>
        <div
          ref={ref}
          data-slot="number-field"
          className={cn(className, mergedClassName)}
          {...restProps}
        >
          {valueStatus ? <p role="status">{valueStatus}</p> : null}
          {children}
        </div>
      </NumberFieldContext.Provider>
    )
  }
)
NumberField.displayName = 'NumberField'

type NumberFieldControlProps = React.ComponentPropsWithoutRef<'div'> & {
  asChild?: boolean
}

const NumberFieldControl = React.forwardRef<HTMLDivElement, NumberFieldControlProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const api = useNumberFieldContext()
    const Comp = asChild ? Slot : 'div'
    const controlProps = api.getControlProps()
    const mergedProps = mergeProps(controlProps, props) as React.HTMLAttributes<HTMLDivElement>
    const { className: mergedClassName, ...restProps } = mergedProps

    return (
      <Comp
        ref={ref}
        data-slot="number-field-control"
        className={cn(className, mergedClassName)}
        {...restProps}
      />
    )
  }
)
NumberFieldControl.displayName = 'NumberFieldControl'

type NumberFieldInputProps = React.ComponentPropsWithoutRef<'input'> & {
  asChild?: boolean
}

const NumberFieldInput = React.forwardRef<HTMLInputElement, NumberFieldInputProps>(
  ({ asChild = false, className, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, ...props }, ref) => {
    const api = useNumberFieldContext()
    const Comp = asChild ? Slot : 'input'
    const inputProps = api.getInputProps()
    const named = Boolean(
      ariaLabel || ariaLabelledBy || inputProps['aria-label'] || inputProps['aria-labelledby']
    )
    const mergedProps = mergeProps(
      inputProps,
      props,
      ariaLabel ? { 'aria-label': ariaLabel } : {},
      ariaLabelledBy ? { 'aria-labelledby': ariaLabelledBy } : {},
      named ? {} : { 'aria-label': 'Number' }
    ) as React.InputHTMLAttributes<HTMLInputElement>
    const { className: mergedClassName, onKeyDown: inputKeyDown, ...restProps } = mergedProps
    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      inputKeyDown?.(event)
      if (event.defaultPrevented || event.currentTarget.disabled || event.currentTarget.readOnly) return
      if (event.key !== 'PageUp' && event.key !== 'PageDown') return
      const current = api.valueAsNumber
      if (!Number.isFinite(current)) return
      const step = Number(event.currentTarget.step) || 1
      let next = current + (event.key === 'PageUp' ? 10 : -10) * step
      const min = event.currentTarget.min === '' ? undefined : Number(event.currentTarget.min)
      const max = event.currentTarget.max === '' ? undefined : Number(event.currentTarget.max)
      if (min != null && Number.isFinite(min)) next = Math.max(min, next)
      if (max != null && Number.isFinite(max)) next = Math.min(max, next)
      event.preventDefault()
      api.setValue(next)
    }

    return (
      <Comp
        ref={ref}
        data-slot="number-field-input"
        className={cn(className, mergedClassName)}
        {...restProps}
        onKeyDown={onKeyDown}
      />
    )
  }
)
NumberFieldInput.displayName = 'NumberFieldInput'

type NumberFieldIncrementProps = React.ComponentPropsWithoutRef<'button'> & {
  asChild?: boolean
}

const NumberFieldIncrement = React.forwardRef<HTMLButtonElement, NumberFieldIncrementProps>(
  ({ asChild = false, className, type, ...props }, ref) => {
    const api = useNumberFieldContext()
    const Comp = asChild ? Slot : 'button'
    const incrementProps = api.getIncrementTriggerProps()
    const mergedProps = mergeProps(incrementProps, props) as React.ButtonHTMLAttributes<HTMLButtonElement>
    const { className: mergedClassName, type: mergedType, ...restProps } = mergedProps

    return (
      <Comp
        ref={ref}
        data-slot="number-field-increment"
        className={cn(className, mergedClassName)}
        type={asChild ? type : (type ?? mergedType ?? 'button')}
        {...restProps}
      />
    )
  }
)
NumberFieldIncrement.displayName = 'NumberFieldIncrement'

type NumberFieldDecrementProps = React.ComponentPropsWithoutRef<'button'> & {
  asChild?: boolean
}

const NumberFieldDecrement = React.forwardRef<HTMLButtonElement, NumberFieldDecrementProps>(
  ({ asChild = false, className, type, ...props }, ref) => {
    const api = useNumberFieldContext()
    const Comp = asChild ? Slot : 'button'
    const decrementProps = api.getDecrementTriggerProps()
    const mergedProps = mergeProps(decrementProps, props) as React.ButtonHTMLAttributes<HTMLButtonElement>
    const { className: mergedClassName, type: mergedType, ...restProps } = mergedProps

    return (
      <Comp
        ref={ref}
        data-slot="number-field-decrement"
        className={cn(className, mergedClassName)}
        type={asChild ? type : (type ?? mergedType ?? 'button')}
        {...restProps}
      />
    )
  }
)
NumberFieldDecrement.displayName = 'NumberFieldDecrement'

export { NumberField, NumberFieldControl, NumberFieldInput, NumberFieldIncrement, NumberFieldDecrement }

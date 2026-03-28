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
  type NumberFieldValueChangeDetails,
  type NumberFieldValueInvalidDetails,
} from '@timui/core'
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
    const controlledValue = toStringValue(value)
    const uncontrolledDefaultValue = value === undefined ? toStringValue(defaultValue) : undefined

    const service = useMachine(
      numberFieldMachine as never,
      {
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
      } as never
    )

    const api = React.useMemo(
      () =>
        (
          numberFieldConnect as never as (
            state: never,
            props: typeof normalizeProps
          ) => NumberFieldApi
        )(service as never, normalizeProps),
      [service]
    )
    const rootProps = api.getRootProps()
    const mergedProps = mergeProps(rootProps, props) as React.HTMLAttributes<HTMLDivElement>
    const { className: mergedClassName, ...restProps } = mergedProps

    return (
      <NumberFieldContext.Provider value={api}>
        <div
          ref={ref}
          data-slot="number-field"
          className={cn(className, mergedClassName)}
          {...restProps}
        />
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
  ({ asChild = false, className, ...props }, ref) => {
    const api = useNumberFieldContext()
    const Comp = asChild ? Slot : 'input'
    const inputProps = api.getInputProps()
    const mergedProps = mergeProps(inputProps, props) as React.InputHTMLAttributes<HTMLInputElement>
    const { className: mergedClassName, ...restProps } = mergedProps

    return (
      <Comp
        ref={ref}
        data-slot="number-field-input"
        className={cn(className, mergedClassName)}
        {...restProps}
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
    const mergedProps = mergeProps(
      incrementProps,
      props
    ) as React.ButtonHTMLAttributes<HTMLButtonElement>
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
    const mergedProps = mergeProps(
      decrementProps,
      props
    ) as React.ButtonHTMLAttributes<HTMLButtonElement>
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

export {
  NumberField,
  NumberFieldControl,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
}

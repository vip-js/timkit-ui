'use client'

import * as React from 'react'
import { createContext, useContext } from 'react'
import type { AssertNoExtraKeys, StepperProps as CoreStepperProps } from '@timui/core'
import {
  cn,
  createTimEvent,
  stepperConnect,
  stepperDescriptionVariants,
  stepperIndicatorCheckVariants,
  stepperIndicatorLabelVariants,
  stepperIndicatorLoaderVariants,
  stepperIndicatorVariants,
  stepperItemVariants,
  stepperMachine,
  stepperSeparatorVariants,
  stepperTitleVariants,
  stepperTriggerVariants,
  stepperVariants,
} from '@timui/core'
import type { Machine as ZagMachine, MachineSchema as ZagMachineSchema } from '@zag-js/core'
import type { Machine as NumberInputMachine } from '@zag-js/number-input'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import { CheckIcon, LoaderCircleIcon } from 'lucide-react'

import { Slot } from './slot'

// Types
type StepperContextValue = {
  api: ReturnType<typeof stepperConnect>
  activeStep: number | null
  setActiveStep: (step: number) => void
  orientation: 'horizontal' | 'vertical'
  readOnly: boolean
}

type StepItemContextValue = {
  step: number
  state: StepState
  isDisabled: boolean
  isLoading: boolean
}

type StepState = 'active' | 'completed' | 'inactive' | 'loading'
type InferMachineSchema<T> = T extends ZagMachine<infer S> ? S : ZagMachineSchema
type NumberInputSchema = InferMachineSchema<NumberInputMachine>

// Contexts
const StepperContext = createContext<StepperContextValue | undefined>(undefined)
const StepItemContext = createContext<StepItemContextValue | undefined>(undefined)

const useStepper = () => {
  const context = useContext(StepperContext)
  if (!context) {
    throw new Error('useStepper must be used within a Stepper')
  }
  return context
}

const useStepItem = () => {
  const context = useContext(StepItemContext)
  if (!context) {
    throw new Error('useStepItem must be used within a StepperItem')
  }
  return context
}

// Components
type StepperProps = CoreStepperProps & React.HTMLAttributes<HTMLDivElement>
type _StepperPropsGuard = AssertNoExtraKeys<
  StepperProps,
  CoreStepperProps & React.HTMLAttributes<HTMLDivElement>
>

function Stepper({
  defaultValue = '0',
  value,
  onValueChange,
  orientation = 'horizontal',
  readOnly = false,
  min,
  max,
  step: stepSize,
  className,
  children,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: StepperProps) {
  const generatedId = React.useId()
  const stepperId = props.id ?? generatedId
  const controlled = value !== undefined
  const normalizedValue = !controlled ? undefined : value == null ? '' : typeof value === 'number' ? String(value) : value
  const normalizedDefaultValue = controlled
    ? undefined
    : typeof defaultValue === 'number'
      ? String(defaultValue)
      : defaultValue

  const service = useMachine<NumberInputSchema>(stepperMachine, {
    id: stepperId,
    value: normalizedValue,
    defaultValue: normalizedDefaultValue,
    ...(typeof min === 'number' ? { min } : {}),
    ...(typeof max === 'number' ? { max } : {}),
    ...(typeof stepSize === 'number' ? { step: stepSize } : {}),
    readOnly,
    onValueChange(details: { value: string; valueAsNumber: number }) {
      onValueChange?.(
        createTimEvent('change', stepperId, {
          value: details.value,
          valueAsNumber: details.valueAsNumber,
        }) as never as Parameters<NonNullable<CoreStepperProps['onValueChange']>>[0]
      )
    },
  })

  const api = stepperConnect(service, normalizeProps)

  const currentStep = !controlled
    ? Number.isFinite(api.valueAsNumber)
      ? api.valueAsNumber
      : 0
    : value == null
      ? null
      : Number.isFinite(Number(value))
        ? Number(value)
        : null
  const steps = React.Children.toArray(children).filter(React.isValidElement)
  const stepIndex =
    currentStep == null
      ? -1
      : steps.findIndex((child) => (child.props as { step?: number }).step === currentStep)
  const stepStatus = stepIndex < 0 ? '' : `Step ${stepIndex + 1} of ${steps.length}`
  const setActiveStep = React.useCallback(
    (step: number) => {
      if (readOnly) return
      if (typeof min === 'number' && step < min) return
      if (typeof max === 'number' && step > max) return
      if (controlled) {
        onValueChange?.(
          createTimEvent('change', stepperId, {
            value: String(step),
            valueAsNumber: step,
          }) as never as Parameters<NonNullable<CoreStepperProps['onValueChange']>>[0]
        )
        return
      }
      api.setValue(step)
    },
    [api, controlled, max, min, onValueChange, readOnly, stepperId]
  )

  return (
    <StepperContext.Provider
      value={{
        api,
        activeStep: currentStep,
        setActiveStep,
        orientation,
        readOnly,
      }}
    >
      <div
        data-slot="stepper"
        className={cn(stepperVariants(), className)}
        data-orientation={orientation}
        aria-readonly={readOnly || undefined}
        {...(mergeProps(api.getRootProps(), props) as React.HTMLAttributes<HTMLDivElement>)}
        role="group"
        aria-labelledby={ariaLabelledBy}
        aria-label={
          ariaLabelledBy ? undefined : typeof ariaLabel === 'string' && ariaLabel ? ariaLabel : 'Stepper'
        }
      >
        {stepStatus ? <p role="status">{stepStatus}</p> : null}
        {children}
      </div>
    </StepperContext.Provider>
  )
}

// StepperItem
interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number
  completed?: boolean
  disabled?: boolean
  loading?: boolean
}

function StepperItem({
  step,
  completed = false,
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}: StepperItemProps) {
  const { activeStep } = useStepper()

  const state: StepState =
    completed || (activeStep !== null && step < activeStep)
      ? 'completed'
      : activeStep === step
        ? 'active'
        : 'inactive'

  const isLoading = loading && step === activeStep

  return (
    <StepItemContext.Provider value={{ step, state, isDisabled: disabled, isLoading }}>
      <div
        data-slot="stepper-item"
        className={cn(stepperItemVariants(), className)}
        data-state={state}
        {...(isLoading ? { 'data-loading': true } : {})}
        {...props}
      >
        {children}
      </div>
    </StepItemContext.Provider>
  )
}

// StepperTrigger
interface StepperTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

function StepperTrigger({
  asChild = false,
  className,
  children,
  disabled,
  onClick,
  ...props
}: StepperTriggerProps) {
  const { setActiveStep, readOnly, orientation } = useStepper()
  const { step, state, isDisabled } = useStepItem()
  const blocked = isDisabled || disabled || readOnly

  if (asChild) {
    const Comp = asChild ? Slot : 'span'
    return (
      <Comp
        data-slot="stepper-trigger"
        className={className}
        aria-current={state === 'active' ? 'step' : undefined}
      >
        {children}
      </Comp>
    )
  }

  return (
    <button
      data-slot="stepper-trigger"
      data-step={step}
      className={cn(stepperTriggerVariants(), className)}
      {...props}
      aria-current={state === 'active' ? 'step' : undefined}
      disabled={blocked}
      onKeyDown={(event) => {
        if (blocked) return
        const root = event.currentTarget.closest('[data-slot="stepper"]')
        if (!root) return
        const horizontal = orientation === 'horizontal'
        const triggers = [...root.querySelectorAll<HTMLButtonElement>('[data-slot="stepper-trigger"]')].filter(
          (node) => !node.disabled
        )
        const current = triggers.indexOf(event.currentTarget)
        if (current < 0) return
        let next = current
        if (event.key === 'Home') next = 0
        else if (event.key === 'End') next = triggers.length - 1
        else {
          const delta = horizontal
            ? event.key === 'ArrowRight'
              ? 1
              : event.key === 'ArrowLeft'
                ? -1
                : 0
            : event.key === 'ArrowDown'
              ? 1
              : event.key === 'ArrowUp'
                ? -1
                : 0
          if (!delta) return
          next = current + delta
          if (next < 0 || next >= triggers.length) return
        }
        const stepValue = Number(triggers[next]?.dataset.step)
        if (!Number.isFinite(stepValue) || stepValue === step) return
        event.preventDefault()
        setActiveStep(stepValue)
      }}
      onClick={(event) => {
        onClick?.(event)
        if (blocked || event.defaultPrevented) return
        setActiveStep(step)
      }}
    >
      {children}
    </button>
  )
}

// StepperIndicator
interface StepperIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

function StepperIndicator({
  asChild = false,
  className,
  children,
  ...props
}: StepperIndicatorProps) {
  const { state, step, isLoading } = useStepItem()

  return (
    <span
      data-slot="stepper-indicator"
      className={cn(stepperIndicatorVariants(), className)}
      data-state={state}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          <span className={stepperIndicatorLabelVariants()}>{step}</span>
          <CheckIcon className={stepperIndicatorCheckVariants()} size={16} aria-hidden="true" />
          {isLoading && (
            <span className={stepperIndicatorLoaderVariants()}>
              <LoaderCircleIcon className="animate-spin" size={14} aria-hidden="true" />
            </span>
          )}
        </>
      )}
    </span>
  )
}

// StepperTitle
function StepperTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 data-slot="stepper-title" className={cn(stepperTitleVariants(), className)} {...props} />
  )
}

// StepperDescription
function StepperDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="stepper-description"
      className={cn(stepperDescriptionVariants(), className)}
      {...props}
    />
  )
}

// StepperSeparator
function StepperSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="stepper-separator"
      className={cn(stepperSeparatorVariants(), className)}
      {...props}
    />
  )
}

export {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
}

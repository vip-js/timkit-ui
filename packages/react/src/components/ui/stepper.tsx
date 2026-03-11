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
  activeStep: number
  setActiveStep: (step: number) => void
  orientation: 'horizontal' | 'vertical'
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
  className,
  ...props
}: StepperProps) {
  const generatedId = React.useId()
  const stepperId = props.id ?? generatedId
  const normalizedValue = typeof value === 'number' ? String(value) : value
  const normalizedDefaultValue =
    typeof defaultValue === 'number' ? String(defaultValue) : defaultValue

  const service = useMachine<NumberInputSchema>(stepperMachine, {
    id: stepperId,
    value: normalizedValue,
    defaultValue: normalizedDefaultValue,
    onValueChange(details: { value: string; valueAsNumber: number }) {
      onValueChange?.(
        createTimEvent('change', stepperId, {
          value: details.value,
          valueAsNumber: details.valueAsNumber,
        }) as never as Parameters<NonNullable<CoreStepperProps['onValueChange']>>[0]
      )
    },
  })

  const api = React.useMemo(() => stepperConnect(service, normalizeProps), [service])

  const currentStep = Number.isFinite(api.valueAsNumber) ? api.valueAsNumber : 0
  const setActiveStep = React.useCallback(
    (step: number) => {
      api.setValue(step)
    },
    [api]
  )

  return (
    <StepperContext.Provider
      value={{
        api,
        activeStep: currentStep,
        setActiveStep,
        orientation,
      }}
    >
      <div
        data-slot="stepper"
        className={cn(stepperVariants(), className)}
        data-orientation={orientation}
        {...(mergeProps(api.getRootProps(), props) as React.HTMLAttributes<HTMLDivElement>)}
      />
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
    completed || step < activeStep ? 'completed' : activeStep === step ? 'active' : 'inactive'

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

function StepperTrigger({ asChild = false, className, children, ...props }: StepperTriggerProps) {
  const { setActiveStep } = useStepper()
  const { step, isDisabled } = useStepItem()

  if (asChild) {
    const Comp = asChild ? Slot : 'span'
    return (
      <Comp data-slot="stepper-trigger" className={className}>
        {children}
      </Comp>
    )
  }

  return (
    <button
      data-slot="stepper-trigger"
      className={cn(stepperTriggerVariants(), className)}
      onClick={() => setActiveStep(step)}
      disabled={isDisabled}
      {...props}
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

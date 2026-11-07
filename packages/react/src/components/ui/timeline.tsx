'use client'
'use client'

import * as React from 'react'
import type { AssertNoExtraKeys, TimelineProps as CoreTimelineProps } from '@timui/core'
import {
  cn,
  timelineContentVariants,
  timelineDateVariants,
  timelineHeaderVariants,
  timelineIndicatorVariants,
  timelineItemVariants,
  timelineSeparatorVariants,
  timelineTitleVariants,
  timelineVariants,
} from '@timui/core'

import { Slot } from './slot'

// Types
type TimelineContextValue = {
  activeStep: number | null
  setActiveStep: (step: number) => void
  disabled: boolean
}

// Context
const TimelineContext = React.createContext<TimelineContextValue | undefined>(undefined)

const useTimeline = () => {
  const context = React.useContext(TimelineContext)
  if (!context) {
    throw new Error('useTimeline must be used within a Timeline')
  }
  return context
}

// Components
type TimelineProps = CoreTimelineProps & React.HTMLAttributes<HTMLDivElement>
type _TimelinePropsGuard = AssertNoExtraKeys<
  TimelineProps,
  CoreTimelineProps & React.HTMLAttributes<HTMLDivElement>
>

function Timeline({
  defaultValue = 1,
  value,
  onValueChange,
  orientation = 'vertical',
  disabled = false,
  className,
  children,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: TimelineProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const currentStep = value === undefined ? uncontrolled : value
  const steps = React.Children.toArray(children).filter(React.isValidElement)
  const stepIndex =
    currentStep == null
      ? -1
      : steps.findIndex((child) => (child.props as { step?: number }).step === currentStep)
  const stepStatus = stepIndex < 0 ? '' : `Step ${stepIndex + 1} of ${steps.length}`
  const setActiveStep = (step: number) => {
    if (disabled) return
    if (value === undefined) setUncontrolled(step)
    onValueChange?.(step)
  }

  return (
    <TimelineContext.Provider value={{ activeStep: currentStep, setActiveStep, disabled }}>
      <div
        data-slot="timeline"
        className={cn(timelineVariants(), className)}
        data-orientation={orientation}
        aria-disabled={disabled || undefined}
        data-disabled={disabled ? '' : undefined}
        {...props}
        aria-labelledby={ariaLabelledBy}
        aria-label={
          ariaLabelledBy ? undefined : typeof ariaLabel === 'string' && ariaLabel ? ariaLabel : 'Timeline'
        }
      >
        {stepStatus ? <p role="status">{stepStatus}</p> : null}
        {children}
      </div>
    </TimelineContext.Provider>
  )
}

// TimelineContent
function TimelineContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="timeline-content"
      className={cn(timelineContentVariants(), className)}
      {...props}
    />
  )
}

// TimelineDate
interface TimelineDateProps extends React.HTMLAttributes<HTMLTimeElement> {
  asChild?: boolean
}

function TimelineDate({ asChild = false, className, ...props }: TimelineDateProps) {
  const Comp = asChild ? Slot : 'time'

  return (
    <Comp data-slot="timeline-date" className={cn(timelineDateVariants(), className)} {...props} />
  )
}

// TimelineHeader
function TimelineHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="timeline-header"
      className={cn(timelineHeaderVariants(), className)}
      {...props}
    />
  )
}

// TimelineIndicator
interface TimelineIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

function TimelineIndicator({
  asChild = false,
  className,
  children,
  ...props
}: TimelineIndicatorProps) {
  return (
    <div
      data-slot="timeline-indicator"
      className={cn(timelineIndicatorVariants(), className)}
      aria-hidden="true"
      {...props}
    >
      {children}
    </div>
  )
}

// TimelineItem
interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number
  disabled?: boolean
}

function TimelineItem({ step, disabled = false, className, onClick, onKeyDown, ...props }: TimelineItemProps) {
  const { activeStep, setActiveStep, disabled: groupDisabled } = useTimeline()
  const locked = disabled || groupDisabled
  const active = activeStep == null ? Number.NaN : activeStep
  const state = step === active ? 'active' : step < active ? 'completed' : 'inactive'

  return (
    <div
      data-slot="timeline-item"
      className={cn(timelineItemVariants(), className)}
      data-state={state}
      data-completed={(Number.isFinite(active) && step <= active) || undefined}
      data-step={step}
      aria-current={state === 'active' ? 'step' : undefined}
      aria-disabled={locked || undefined}
      role="button"
      tabIndex={locked ? -1 : 0}
      {...props}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented || locked) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          setActiveStep(step)
          return
        }
        const root = event.currentTarget.closest('[data-slot="timeline"]')
        if (!root) return
        const horizontal = root.getAttribute('data-orientation') === 'horizontal'
        const items = [...root.querySelectorAll<HTMLElement>('[data-slot="timeline-item"]')].filter(
          (node) => node.getAttribute('aria-disabled') !== 'true'
        )
        const current = items.indexOf(event.currentTarget)
        if (current < 0) return
        let next = current
        if (event.key === 'Home') next = 0
        else if (event.key === 'End') next = items.length - 1
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
          if (next < 0 || next >= items.length) return
        }
        const stepValue = Number(items[next]?.dataset.step)
        if (!Number.isFinite(stepValue) || stepValue === step) return
        event.preventDefault()
        setActiveStep(stepValue)
      }}
      onClick={(event) => {
        onClick?.(event)
        if (locked || event.defaultPrevented) return
        setActiveStep(step)
      }}
    />
  )
}

// TimelineSeparator
function TimelineSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="timeline-separator"
      className={cn(timelineSeparatorVariants(), className)}
      aria-hidden="true"
      {...props}
    />
  )
}

// TimelineTitle
function TimelineTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 data-slot="timeline-title" className={cn(timelineTitleVariants(), className)} {...props} />
  )
}

export {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
}

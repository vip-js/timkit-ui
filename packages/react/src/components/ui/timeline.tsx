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
  activeStep: number
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
  orientation = 'vertical',
  className,
  ...props
}: TimelineProps) {
  const currentStep = value ?? defaultValue

  return (
    <TimelineContext.Provider value={{ activeStep: currentStep }}>
      <div
        data-slot="timeline"
        className={cn(timelineVariants(), className)}
        data-orientation={orientation}
        {...props}
      />
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
}

function TimelineItem({ step, className, ...props }: TimelineItemProps) {
  const { activeStep } = useTimeline()

  return (
    <div
      data-slot="timeline-item"
      className={cn(timelineItemVariants(), className)}
      data-completed={step <= activeStep || undefined}
      {...props}
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

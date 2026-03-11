'use client'

import * as React from 'react'
import * as numberInput from '@zag-js/number-input'
import { normalizeProps, useMachine } from '@zag-js/react'

import { cn } from '../lib/utils'
import { Button } from './button'

export interface StepperProps extends Omit<numberInput.Props, 'id'> {
  className?: string
  children?: React.ReactNode
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>((props, ref) => {
  const { className, children, ...context } = props
  const service: numberInput.Service = (
    useMachine as (m: numberInput.Machine, p: Partial<numberInput.Props>) => numberInput.Service
  )(numberInput.machine, { id: React.useId(), ...context })

  const api = numberInput.connect(service, normalizeProps)

  return (
    <div ref={ref} {...api.getRootProps()} className={cn('flex items-center space-x-2', className)}>
      <Button variant="outline" size="icon" className="h-8 w-8" {...api.getDecrementTriggerProps()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M5 12h14" />
        </svg>
      </Button>
      <div className="relative">
        <input
          className={cn(
            'flex h-9 w-20 rounded-md border border-input bg-transparent px-3 py-1 text-center text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
          )}
          {...api.getInputProps()}
        />
      </div>
      <Button variant="outline" size="icon" className="h-8 w-8" {...api.getIncrementTriggerProps()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </Button>
    </div>
  )
})
Stepper.displayName = 'Stepper'

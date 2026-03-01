'use client'

import * as React from 'react'
import { cn, radioGroupMachine } from '@timui/core'
import { CircleIcon } from 'lucide-react'

import { useMachine } from '../hooks/use-machine'

// Context
const RadioGroupContext = React.createContext<{
  state: any
  send: (event: any) => void
  disabled?: boolean
  required?: boolean
  name?: string
} | null>(null)

function useRadioGroup() {
  const context = React.useContext(RadioGroupContext)
  if (!context) {
    throw new Error('RadioGroupItem must be used within RadioGroup')
  }
  return context
}

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    disabled?: boolean
    required?: boolean
    name?: string
  }
>(({ className, value, defaultValue, onValueChange, disabled, required, name, ...props }, ref) => {
  const [state, send] = useMachine(radioGroupMachine, {
    context: {
      value: value !== undefined ? value : defaultValue,
      disabled,
      required,
      name,
    },
  })

  // Sync controlled value
  React.useEffect(() => {
    if (value !== undefined && value !== state.context.value) {
      send({ type: 'VALUE.SET', value })
    }
  }, [value, send, state.context.value])

  const contextValue = React.useMemo(
    () => ({
      state,
      send: (evt: any) => {
        send(evt)
        if (evt.type === 'VALUE.SET') {
          onValueChange?.(evt.value)
        }
      },
      disabled,
      required,
      name,
    }),
    [state, send, disabled, required, name, onValueChange]
  )

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div role="radiogroup" className={cn('grid gap-2', className)} ref={ref} {...props} />
    </RadioGroupContext.Provider>
  )
})
RadioGroup.displayName = 'RadioGroup'

const RadioGroupItem = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> & { value: string }
>(({ className, value, disabled: itemDisabled, ...props }, ref) => {
  const { state, send, disabled: groupDisabled, required, name } = useRadioGroup()

  const isChecked = state.context.value === value
  const isDisabled = groupDisabled || itemDisabled

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isChecked}
      data-state={isChecked ? 'checked' : 'unchecked'}
      disabled={isDisabled}
      aria-required={required}
      name={name}
      value={value}
      ref={ref}
      onClick={() => {
        if (!isDisabled) {
          send({ type: 'VALUE.SET', value })
        }
      }}
      className={cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary hover:shadow-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <span data-slot="radio-indicator" className="flex items-center justify-center">
        {isChecked && (
          <CircleIcon className="h-2.5 w-2.5 fill-current text-current" strokeWidth={0} />
        )}
      </span>
    </button>
  )
})
RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }

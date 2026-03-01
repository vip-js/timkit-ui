'use client'

import * as React from 'react'
import { cn, toggleMachine } from '@timui/core'
import { cva, type VariantProps } from 'class-variance-authority'

import { useMachine } from '../hooks/use-machine'

export const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-9 px-2.5',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const Toggle = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof toggleVariants> & {
      pressed?: boolean
      defaultPressed?: boolean
      onPressedChange?: (pressed: boolean) => void
    }
>(({ className, pressed, defaultPressed, onPressedChange, variant, size, ...props }, ref) => {
  const initialPressed = pressed !== undefined ? pressed : defaultPressed

  const [state, send] = useMachine(toggleMachine, {
    context: {
      pressed: initialPressed !== undefined ? initialPressed : false,
    },
  })

  // Sync
  React.useEffect(() => {
    if (pressed !== undefined && pressed !== state.context.pressed) {
      send({ type: 'PRESSED.SET', pressed })
    }
  }, [pressed, send, state.context.pressed])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    send({ type: 'PRESSED.TOGGLE' })
    // We assume toggle machine toggles correctly.
    // Ideally we get next state to callback.
    const nextPressed = !state.context.pressed
    onPressedChange?.(nextPressed)
    props.onClick?.(e)
  }

  return (
    <button
      ref={ref}
      data-slot="toggle"
      data-state={state.context.pressed ? 'on' : 'off'}
      aria-pressed={state.context.pressed}
      type="button"
      className={cn(toggleVariants({ variant, size, className }))}
      onClick={handleClick}
      {...props}
    />
  )
})
Toggle.displayName = 'Toggle'

export { Toggle }

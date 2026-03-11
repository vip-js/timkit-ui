'use client'

import * as React from 'react'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as toggle from '@zag-js/toggle'

import { cva, type VariantProps } from '../lib/cva'
import { cn } from '../lib/utils'

const toggleVariants = cva(
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
  const service: toggle.Service = useMachine(toggle.machine, {
    pressed,
    defaultPressed,
    disabled: props.disabled,
    onPressedChange: (pressed: boolean) => onPressedChange?.(pressed),
  })
  const api = toggle.connect(service, normalizeProps)
  const rootProps = api.getRootProps()
  const mergedProps = mergeProps(rootProps, props)
  const { className: mergedClassName, ...restProps } = mergedProps

  return (
    <button
      ref={ref}
      type="button"
      className={cn(toggleVariants({ variant, size, className }), mergedClassName)}
      {...restProps}
    />
  )
})
Toggle.displayName = 'Toggle'

export { Toggle, toggleVariants }

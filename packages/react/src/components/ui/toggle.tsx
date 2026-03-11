'use client'

import * as React from 'react'
import { cn, toggleVariants, type ToggleVariants } from '@timui/core'
import { mergeProps } from '@zag-js/react'

import { useToggle } from './toggle/use-toggle'

const Toggle = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    ToggleVariants & {
      pressed?: boolean
      defaultPressed?: boolean
      onPressedChange?: (pressed: boolean) => void
    }
>(({ className, pressed, defaultPressed, onPressedChange, variant, size, ...props }, ref) => {
  const api = useToggle({
    pressed,
    defaultPressed,
    disabled: props.disabled,
    onPressedChange,
  })
  const rootProps = api.getRootProps()
  const mergedProps = mergeProps(rootProps, props)
  const { className: mergedClassName, ...restProps } = mergedProps

  return (
    <button
      ref={ref}
      data-slot="toggle"
      data-state={api.pressed ? 'on' : 'off'}
      aria-pressed={api.pressed}
      type="button"
      className={cn(toggleVariants({ variant, size, className }), mergedClassName)}
      {...restProps}
    />
  )
})
Toggle.displayName = 'Toggle'

export { Toggle }

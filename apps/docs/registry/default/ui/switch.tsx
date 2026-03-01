'use client'

import * as React from 'react'
import { cn, switchThumbVariants, switchVariants } from '@timui/core'

const Switch = React.forwardRef<
  HTMLButtonElement,
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'checked' | 'defaultChecked' | 'onChange' | 'value'
  > & {
    checked?: boolean
    defaultChecked?: boolean
    required?: boolean
    onCheckedChange?: (checked: boolean) => void
    value?: string
  }
>(
  (
    {
      className,
      checked: checkedProp,
      defaultChecked,
      required,
      onCheckedChange,
      value = 'on',
      disabled,
      ...props
    },
    ref
  ) => {
    const [checkedState, setCheckedState] = React.useState<boolean>(
      checkedProp ?? defaultChecked ?? false
    )

    // Sync controlled state
    React.useEffect(() => {
      if (checkedProp !== undefined) {
        setCheckedState(checkedProp)
      }
    }, [checkedProp])

    const isChecked = checkedProp !== undefined ? checkedProp : checkedState

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return

      const nextChecked = !isChecked

      // Update local state if uncontrolled
      if (checkedProp === undefined) {
        setCheckedState(nextChecked)
      }

      onCheckedChange?.(nextChecked)
      props.onClick?.(e)
    }

    return (
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        data-state={isChecked ? 'checked' : 'unchecked'}
        data-slot="switch"
        disabled={disabled}
        value={value}
        className={cn(switchVariants(), className)}
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        <span
          data-slot="switch-thumb"
          data-state={isChecked ? 'checked' : 'unchecked'}
          className={cn(switchThumbVariants())}
        />
      </button>
    )
  }
)
Switch.displayName = 'Switch'

export { Switch }

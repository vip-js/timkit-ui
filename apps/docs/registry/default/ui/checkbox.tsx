'use client'

import * as React from 'react'
import { cn } from '@timui/core'

const Checkbox = React.forwardRef<
  HTMLButtonElement,
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'checked' | 'defaultChecked' | 'onChange' | 'value'
  > & {
    checked?: boolean | 'indeterminate'
    defaultChecked?: boolean | 'indeterminate'
    required?: boolean
    onCheckedChange?: (checked: boolean | 'indeterminate') => void
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
    const isControlled = checkedProp !== undefined
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState<boolean | 'indeterminate'>(
      defaultChecked ?? false
    )
    const isChecked = isControlled ? checkedProp : uncontrolledChecked

    const setChecked = React.useCallback(
      (nextChecked: boolean | 'indeterminate') => {
        if (!isControlled) {
          setUncontrolledChecked(nextChecked)
        }
        onCheckedChange?.(nextChecked)
      },
      [isControlled, onCheckedChange]
    )

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const nextChecked = isChecked === 'indeterminate' ? true : !isChecked
      setChecked(nextChecked)
      props.onClick?.(e)
    }

    return (
      <label data-slot="checkbox-root" className="inline-flex items-center">
        <button
          type="button"
          role="checkbox"
          aria-checked={isChecked === 'indeterminate' ? 'mixed' : isChecked}
          data-state={
            isChecked === 'indeterminate' ? 'indeterminate' : isChecked ? 'checked' : 'unchecked'
          }
          data-slot="checkbox"
          disabled={disabled}
          value={value}
          className={cn(
            'peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          onClick={handleClick}
          {...props}
        >
          <div
            data-slot="checkbox-indicator"
            className={cn(
              'flex items-center justify-center text-current opacity-0 transition-opacity duration-100',
              isChecked && 'opacity-100'
            )}
          >
            {isChecked === 'indeterminate' ? (
              <span className="h-0.5 w-2 rounded-full bg-current" />
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5"
              >
                <path d="M3.5 8.5l3 3 6-7" />
              </svg>
            )}
          </div>
        </button>
        <input
          type="checkbox"
          className="sr-only"
          checked={isChecked === true}
          readOnly
          disabled={disabled}
          required={required}
          value={value}
        />
      </label>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }

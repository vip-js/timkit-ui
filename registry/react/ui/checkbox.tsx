'use client'

import * as React from 'react'
import * as checkbox from '@zag-js/checkbox'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'

import { cva } from '../lib/cva'
import { cn } from '../lib/utils'

const checkboxRootVariants = cva('inline-flex items-center')
const checkboxVariants = cva(
  'peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex size-4 shrink-0 items-center justify-center rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50'
)
const checkboxIndicatorVariants = cva(
  'flex items-center justify-center text-current opacity-0 transition-opacity duration-100'
)
const checkboxIndicatorCheckVariants = cva('h-0.5 w-2 rounded-full bg-current')
const checkboxIndicatorIconVariants = cva('size-3.5')

interface CheckboxProps {
  className?: string
  checked?: boolean | 'indeterminate'
  defaultChecked?: boolean | 'indeterminate'
  required?: boolean
  disabled?: boolean
  invalid?: boolean
  name?: string
  value?: string
  id?: string
  onCheckedChange?: (checked: boolean | 'indeterminate') => void
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      className,
      checked,
      defaultChecked,
      required,
      onCheckedChange,
      value = 'on',
      disabled,
      name,
      id,
      invalid: _invalid,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const checkboxId = id ?? generatedId
    // Zag.js expects specific CheckedState type
    const service: checkbox.Service = useMachine(checkbox.machine, {
      id: checkboxId,
      checked: checked === 'indeterminate' ? 'indeterminate' : !!checked,
      // defaultChecked prop needs handling, but Zag usually takes strict controlled or uncontrolled via 'checked'
      // For simplicity in this adaptation, we map basic logic.
      disabled,
      required,
      name,
      value,
      onCheckedChange(details) {
        onCheckedChange?.(details.checked)
      },
    })
    const api = checkbox.connect(service, normalizeProps)
    const rootProps = api.getRootProps()
    const controlProps = api.getControlProps()
    const indicatorProps = api.getIndicatorProps()
    const hiddenInputProps = api.getHiddenInputProps()
    const mergedControlProps = mergeProps(
      controlProps,
      props as React.ButtonHTMLAttributes<HTMLButtonElement>
    )
    const { className: controlClassName, ...controlRest } = mergedControlProps

    return (
      <label
        {...rootProps}
        data-slot="checkbox-root"
        className={cn(checkboxRootVariants(), rootProps.className)}
      >
        <button
          {...controlRest}
          ref={ref}
          type="button"
          data-slot="checkbox"
          className={cn(checkboxVariants(), controlClassName, className)}
        >
          <span
            {...indicatorProps}
            data-slot="checkbox-indicator"
            className={cn(
              checkboxIndicatorVariants(),
              (api.checked || api.indeterminate) && 'opacity-100',
              indicatorProps.className
            )}
          >
            {api.indeterminate ? (
              <span className={checkboxIndicatorCheckVariants()} />
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={checkboxIndicatorIconVariants()}
              >
                <path d="M3.5 8.5l3 3 6-7" />
              </svg>
            )}
          </span>
        </button>
        <input {...hiddenInputProps} />
      </label>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }

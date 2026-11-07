'use client'

import * as React from 'react'
import type { CheckboxProps as CoreCheckboxProps } from '@timui/core'
import {
  checkboxConnect,
  checkboxIndicatorCheckVariants,
  checkboxIndicatorIconVariants,
  checkboxIndicatorVariants,
  checkboxMachine,
  checkboxRootVariants,
  checkboxVariants,
  cn,
  createTimEvent,
} from '@timui/core'
import { mergeProps } from '@zag-js/react'

import { useCheckbox } from './checkbox/use-checkbox'

type CheckboxProps = CoreCheckboxProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CoreCheckboxProps>

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
      readOnly,
      name,
      id,
      ...props
    },
    ref
  ) => {
    const [on, setOn] = React.useState(defaultChecked === true)
    const checkedNow = checked === undefined ? on : checked === true
    const api = useCheckbox({
      id,
      checked,
      defaultChecked,
      disabled,
      readOnly,
      required,
      name,
      value: value ?? 'on',
      onCheckedChange(event) {
        if (checked === undefined) setOn(event.detail.checked)
        onCheckedChange?.(event)
      },
    })
    const rootProps = api.getRootProps()
    const controlProps = api.getControlProps()
    const indicatorProps = api.getIndicatorProps()
    const hiddenInputProps = api.getHiddenInputProps()
    const ariaLabel = props['aria-label']
    const { 'aria-label': _ariaLabel, ...buttonProps } = props
    const mergedControlProps = mergeProps(controlProps, buttonProps)
    const {
      className: controlClassName,
      onClick: _controlOnClick,
      ...controlRest
    } = mergedControlProps

    const checkStatus = api.indeterminate ? 'Mixed' : checkedNow ? 'Checked' : ''

    return (
      <>
      {checkStatus ? <p role="status">{checkStatus}</p> : null}
      <label
        {...rootProps}
        data-slot="checkbox-root"
        className={cn(checkboxRootVariants(), rootProps.className)}
        onClick={(event) => {
          const target = event.target as HTMLElement | null
          if (target?.tagName === 'INPUT' || disabled || readOnly) return
          event.preventDefault()
          const next = !checkedNow
          if (checked === undefined) setOn(next)
          onCheckedChange?.(createTimEvent('change', id ?? 'checkbox', { checked: next }))
        }}
      >
        <button
          {...controlRest}
          ref={ref}
          type="button"
          data-slot="checkbox"
          data-state={api.indeterminate ? 'indeterminate' : checkedNow ? 'checked' : 'unchecked'}
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
        <input
          {...hiddenInputProps}
          aria-checked={api.indeterminate ? 'mixed' : undefined}
          aria-label={typeof ariaLabel === 'string' && ariaLabel ? ariaLabel : 'Checkbox'}
          aria-labelledby={undefined}
          onKeyDown={(event) => {
            hiddenInputProps.onKeyDown?.(event)
            if (event.key === ' ') event.preventDefault()
          }}
          onKeyUp={(event) => {
            if (event.key !== ' ' || api.disabled || readOnly) return
            event.preventDefault()
            const input = event.currentTarget
            input.checked = !api.checked
            hiddenInputProps.onClick?.(event as unknown as React.MouseEvent<HTMLInputElement>)
          }}
        />
      </label>
      </>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }

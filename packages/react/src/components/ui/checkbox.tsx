'use client'

import * as React from 'react'
import type { CheckboxProps as CoreCheckboxProps } from '@timui/core'
import { checkboxConnect, checkboxMachine, createTimEvent } from '@timui/core'
import {
  checkboxIndicatorCheckVariants,
  checkboxIndicatorIconVariants,
  checkboxIndicatorVariants,
  checkboxRootVariants,
  checkboxVariants,
  cn,
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
      name,
      id,
      ...props
    },
    ref
  ) => {
    const api = useCheckbox({
      id,
      checked,
      defaultChecked,
      disabled,
      required,
      name,
      value: value ?? 'on',
      onCheckedChange,
    })
    const rootProps = api.getRootProps()
    const controlProps = api.getControlProps()
    const indicatorProps = api.getIndicatorProps()
    const hiddenInputProps = api.getHiddenInputProps()
    const mergedControlProps = mergeProps(controlProps, props)
    const {
      className: controlClassName,
      onClick: controlOnClick,
      ...controlRest
    } = mergedControlProps

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
          onClick={(event) => {
            const prevCheckedState = api.checkedState
            if (typeof controlOnClick === 'function') {
              controlOnClick(event)
            }

            // Some composed demos rely on click bubbling and can miss Zag's default toggle.
            // Keep behavior deterministic by applying a fallback toggle when state did not change.
            if (!event.defaultPrevented && api.checkedState === prevCheckedState) {
              api.toggleChecked()
            }
          }}
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

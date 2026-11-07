'use client'

import * as React from 'react'
import type { SwitchProps as CoreSwitchProps } from '@timui/core'
import {
  cn,
  createTimEvent,
  switchConnect,
  switchMachine,
  switchRootVariants,
  switchThumbVariants,
  switchVariants,
} from '@timui/core'
import { mergeProps } from '@zag-js/react'

import { useSwitch } from './switch/use-switch'

type SwitchProps = CoreSwitchProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CoreSwitchProps>

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
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
    const [on, setOn] = React.useState(defaultChecked ?? false)
    const checkedNow = checked === undefined ? on : checked === true
    const api = useSwitch({
      id,
      checked,
      defaultChecked,
      required,
      onCheckedChange,
      value: value ?? 'on',
      disabled,
      readOnly,
      name,
    })
    const rootProps = api.getRootProps()
    const controlProps = api.getControlProps()
    const thumbProps = api.getThumbProps()
    const hiddenInputProps = api.getHiddenInputProps()
    const ariaLabel = props['aria-label']
    const { 'aria-label': _ariaLabel, ...buttonProps } = props
    const mergedControlProps = mergeProps(controlProps, buttonProps)
    const {
      className: controlClassName,
      onClick: _controlOnClick,
      ...controlRest
    } = mergedControlProps

    const checkStatus = checkedNow ? 'On' : ''

    return (
      <>
      {checkStatus ? <p role="status">{checkStatus}</p> : null}
      <label
        {...rootProps}
        data-slot="switch-root"
        htmlFor={undefined}
        className={cn(switchRootVariants(), rootProps.className)}
        onClick={(event) => {
          event.preventDefault()
          const target = event.target as HTMLElement | null
          if (target?.tagName === 'INPUT' || disabled || readOnly) return
          const next = !checkedNow
          if (checked === undefined) setOn(next)
          onCheckedChange?.(createTimEvent('change', id ?? 'switch', { checked: next }))
        }}
      >
        <button
          {...controlRest}
          ref={ref}
          type="button"
          data-slot="switch"
          data-state={checkedNow ? 'checked' : 'unchecked'}
          className={cn(switchVariants(), controlClassName, className)}
        >
          <span
            {...thumbProps}
            data-slot="switch-thumb"
            className={cn(switchThumbVariants(), thumbProps.className)}
          />
        </button>
        <input
          {...hiddenInputProps}
          aria-label={typeof ariaLabel === 'string' && ariaLabel ? ariaLabel : 'Switch'}
          aria-labelledby={undefined}
          defaultChecked={undefined}
          checked={checkedNow}
          onChange={() => {}}
          onClick={(event) => {
            event.stopPropagation()
          }}
          onKeyDown={(event) => {
            if (event.key !== ' ') return
            event.preventDefault()
            if (disabled || readOnly) return
            const next = !checkedNow
            if (checked === undefined) setOn(next)
            onCheckedChange?.(createTimEvent('change', id ?? 'switch', { checked: next }))
          }}
        />
      </label>
      </>
    )
  }
)
Switch.displayName = 'Switch'

export { Switch }

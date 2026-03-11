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
      name,
      id,
      ...props
    },
    ref
  ) => {
    const api = useSwitch({
      id,
      checked,
      defaultChecked,
      required,
      onCheckedChange,
      value: value ?? 'on',
      disabled,
      name,
    })
    const rootProps = api.getRootProps()
    const controlProps = api.getControlProps()
    const thumbProps = api.getThumbProps()
    const hiddenInputProps = api.getHiddenInputProps()
    const mergedControlProps = mergeProps(controlProps, props)
    const { className: controlClassName, ...controlRest } = mergedControlProps

    return (
      <label
        {...rootProps}
        data-slot="switch-root"
        className={cn(switchRootVariants(), rootProps.className)}
      >
        <button
          {...controlRest}
          ref={ref}
          type="button"
          data-slot="switch"
          className={cn(switchVariants(), controlClassName, className)}
        >
          <span
            {...thumbProps}
            data-slot="switch-thumb"
            className={cn(switchThumbVariants(), thumbProps.className)}
          />
        </button>
        <input {...hiddenInputProps} />
      </label>
    )
  }
)
Switch.displayName = 'Switch'

export { Switch }

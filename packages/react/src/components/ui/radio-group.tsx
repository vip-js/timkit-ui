'use client'

import * as React from 'react'
import type {
  AssertNoExtraKeys,
  RadioGroupItemProps as CoreRadioGroupItemProps,
  RadioGroupProps as CoreRadioGroupProps,
} from '@timui/core'
import {
  cn,
  createTimEvent,
  radioGroupConnect,
  radioGroupIndicatorIconVariants,
  radioGroupIndicatorVariants,
  radioGroupItemVariants,
  radioGroupMachine,
  radioGroupVariants,
} from '@timui/core'
import { mergeProps } from '@zag-js/react'
import { CircleIcon } from 'lucide-react'

import { useRadioGroup } from './radio-group/use-radio-group'
import { RadioGroupProvider, useRadioGroupContext } from './radio-group/use-radio-group-context'

type RadioGroupProps = CoreRadioGroupProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof CoreRadioGroupProps>
type _RadioGroupPropsGuard = AssertNoExtraKeys<
  RadioGroupProps,
  CoreRadioGroupProps & React.HTMLAttributes<HTMLDivElement>
>

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      disabled,
      readOnly,
      required,
      name,
      id,
      orientation,
      'aria-label': ariaLabel,
      children,
      ...props
    },
    ref
  ) => {
    const api = useRadioGroup({
      value,
      defaultValue,
      onValueChange,
      disabled,
      readOnly,
      required,
      name,
      id,
      orientation,
    })
    const options = React.Children.toArray(children).filter(React.isValidElement)
    const selected =
      api.value == null || api.value === ''
        ? -1
        : options.findIndex((child) => (child.props as { value?: string }).value === api.value)
    const optionStatus = selected < 0 ? '' : `Option ${selected + 1} of ${options.length}`
    const rootProps = api.getRootProps()
    const mergedRootProps = mergeProps(rootProps, props)
    const { className: rootClassName, onKeyDown: rootKeyDown, ...rootRest } = mergedRootProps
    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      rootKeyDown?.(event)
      if (event.defaultPrevented || disabled || readOnly) return
      if (!/^[a-z]$/i.test(event.key)) return
      const letter = event.key.toLowerCase()
      const items = [...event.currentTarget.querySelectorAll<HTMLElement>('[data-slot="radio-group-item"]')].filter(
        (item) => item.getAttribute('data-disabled') == null && item.getAttribute('aria-disabled') !== 'true'
      )
      const current = items.findIndex((item) => item.getAttribute('data-state') === 'checked')
      for (let step = 1; step <= items.length; step += 1) {
        const next = items[(current + step) % items.length]
        const name = (next?.textContent ?? '').replace(/\s+/g, ' ').trim()
        if (!name.toLowerCase().startsWith(letter)) continue
        const nextValue = next.querySelector('input')?.getAttribute('value')
        if (!nextValue) return
        event.preventDefault()
        api.setValue(nextValue)
        return
      }
    }

    return (
      <RadioGroupProvider value={api}>
        <>
          {optionStatus ? <p role="status">{optionStatus}</p> : null}
          <div
            {...rootRest}
            onKeyDown={onKeyDown}
            ref={ref}
            aria-label={typeof ariaLabel === 'string' && ariaLabel ? ariaLabel : 'Radio group'}
            data-slot="radio-group"
            className={cn(radioGroupVariants(), rootClassName, className)}
          >
            {children}
          </div>
        </>
      </RadioGroupProvider>
    )
  }
)
RadioGroup.displayName = 'RadioGroup'

type RadioGroupItemProps = CoreRadioGroupItemProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof CoreRadioGroupItemProps>
type _RadioGroupItemPropsGuard = AssertNoExtraKeys<
  RadioGroupItemProps,
  CoreRadioGroupItemProps & React.HTMLAttributes<HTMLDivElement>
>

const RadioGroupItem = React.forwardRef<HTMLDivElement, RadioGroupItemProps>(
  ({ className, value, disabled: itemDisabled, children, ...props }, ref) => {
    const api = useRadioGroupContext()
    const itemProps = api.getItemProps({ value, disabled: itemDisabled })
    const controlProps = api.getItemControlProps({ value, disabled: itemDisabled })
    const hiddenInputProps = api.getItemHiddenInputProps({ value, disabled: itemDisabled })
    const itemState = api.getItemState({ value, disabled: itemDisabled })
    const mergedControlProps = mergeProps(controlProps, props)
    const { className: controlClassName, ...controlRest } = mergedControlProps

    return (
      <label {...itemProps} data-slot="radio-group-item">
        <div
          {...controlRest}
          ref={ref}
          data-slot="radio-control"
          className={cn(radioGroupItemVariants(), controlClassName, className)}
        >
          <span data-slot="radio-indicator" className={radioGroupIndicatorVariants()}>
            {itemState.checked && (
              <CircleIcon aria-hidden="true" className={radioGroupIndicatorIconVariants()} strokeWidth={0} />
            )}
          </span>
        </div>
        <input {...hiddenInputProps} />
        {children}
      </label>
    )
  }
)
RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }

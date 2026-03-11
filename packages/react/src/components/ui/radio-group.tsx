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
    { className, value, defaultValue, onValueChange, disabled, required, name, id, ...props },
    ref
  ) => {
    const api = useRadioGroup({ value, defaultValue, onValueChange, disabled, required, name, id })
    const rootProps = api.getRootProps()
    const mergedRootProps = mergeProps(rootProps, props)
    const { className: rootClassName, ...rootRest } = mergedRootProps

    return (
      <RadioGroupProvider value={api}>
        <div
          {...rootRest}
          ref={ref}
          data-slot="radio-group"
          className={cn(radioGroupVariants(), rootClassName, className)}
        />
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
  ({ className, value, disabled: itemDisabled, ...props }, ref) => {
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
              <CircleIcon className={radioGroupIndicatorIconVariants()} strokeWidth={0} />
            )}
          </span>
        </div>
        <input {...hiddenInputProps} />
      </label>
    )
  }
)
RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }

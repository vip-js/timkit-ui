'use client'

import * as React from 'react'
import type { AssertNoExtraKeys, SelectNativeProps as CoreSelectNativeProps } from '@timui/core'
import {
  cn,
  selectNativeIndicatorVariants,
  selectNativeVariants,
  selectNativeWrapperVariants,
} from '@timui/core'
import { ChevronDownIcon } from 'lucide-react'

type SelectNativeProps = CoreSelectNativeProps &
  Omit<React.ComponentProps<'select'>, keyof CoreSelectNativeProps>
type _SelectNativePropsGuard = AssertNoExtraKeys<
  SelectNativeProps,
  CoreSelectNativeProps & React.ComponentProps<'select'>
>

const SelectNative = ({
  className,
  children,
  onValueChange,
  onChange,
  ...props
}: SelectNativeProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event)
    if (props.multiple) {
      const values = Array.from(event.target.selectedOptions).map((option) => option.value)
      onValueChange?.(values)
      return
    }
    onValueChange?.(event.target.value)
  }

  return (
    <div className={selectNativeWrapperVariants()}>
      <select
        data-slot="select-native"
        className={cn(selectNativeVariants({ multiple: props.multiple }), className)}
        onChange={handleChange}
        {...props}
      >
        {children}
      </select>
      {!props.multiple && (
        <span className={selectNativeIndicatorVariants()}>
          <ChevronDownIcon size={16} aria-hidden="true" />
        </span>
      )}
    </div>
  )
}

export { SelectNative }

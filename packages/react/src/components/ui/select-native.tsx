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

function nativeOptionValues(children: React.ReactNode): string[] {
  return React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement(child)) return []
    const props = child.props as { value?: string | number | boolean | null; children?: React.ReactNode }
    const own = props.value != null ? [String(props.value)] : []
    return [...own, ...nativeOptionValues(props.children)]
  })
}

function nativeOptionStatus(current: string | string[], values: string[]) {
  const picked = (Array.isArray(current) ? current : [current]).map(String).filter((item) => item && values.includes(item))
  if (picked.length > 1) return `${picked.length} options selected`
  if (picked.length === 1) return `Option ${values.indexOf(picked[0]) + 1} of ${values.length}`
  return ''
}

const SelectNative = ({
  className,
  children,
  onValueChange,
  onChange,
  disabled,
  value,
  defaultValue,
  multiple,
  options,
  ...props
}: SelectNativeProps) => {
  const [uncontrolled, setUncontrolled] = React.useState<string | string[]>(
    defaultValue ?? (multiple ? [] : '')
  )
  const emptyValue = multiple ? [] : ''
  const current = value === undefined ? uncontrolled : value == null ? emptyValue : value
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (disabled) {
      event.target.value = Array.isArray(current) ? '' : String(current ?? '')
      return
    }
    onChange?.(event)
    if (multiple) {
      const values = Array.from(event.target.selectedOptions).map((option) => option.value)
      if (value === undefined) setUncontrolled(values)
      else event.target.value = ''
      onValueChange?.(values)
      return
    }
    const next = event.target.value
    if (value === undefined) setUncontrolled(next)
    else event.target.value = String(current ?? '')
    onValueChange?.(next)
  }
  const optionNodes =
    children ??
    options?.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))

  const optionStatus = nativeOptionStatus(current, nativeOptionValues(optionNodes))

  return (
    <div className={selectNativeWrapperVariants()}>
      {optionStatus ? <p role="status">{optionStatus}</p> : null}
      <select
        data-slot="select-native"
        className={cn(selectNativeVariants({ multiple }), className)}
        value={current}
        disabled={disabled}
        multiple={multiple}
        onChange={handleChange}
        {...props}
      >
        {optionNodes}
      </select>
      {!multiple && (
        <span className={selectNativeIndicatorVariants()}>
          <ChevronDownIcon size={16} aria-hidden="true" />
        </span>
      )}
    </div>
  )
}

export { SelectNative }

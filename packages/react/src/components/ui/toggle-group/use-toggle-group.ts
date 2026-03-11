import * as React from 'react'
import { toggleGroupConnect, toggleGroupMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseToggleGroupProps {
  multiple?: boolean
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
  disabled?: boolean
}

export function useToggleGroup(props: UseToggleGroupProps) {
  const toArray = (val?: string | string[] | null) => {
    if (val == null) return undefined
    return Array.isArray(val) ? val : val === '' ? [] : [val]
  }

  const resolvedValue = toArray(props.value)
  const defaultValueArray = toArray(props.defaultValue)

  const service = useMachine(toggleGroupMachine, {
    id: React.useId(),
    multiple: props.multiple,
    value: resolvedValue,
    defaultValue: resolvedValue === undefined ? defaultValueArray : undefined,
    disabled: props.disabled,
    onValueChange: (details) => {
      const nextValue = props.multiple ? details.value : (details.value[0] ?? '')
      props.onValueChange?.(nextValue)
    },
  })

  return React.useMemo(() => toggleGroupConnect(service, normalizeProps), [service])
}

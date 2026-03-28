import * as React from 'react'
import type { SelectProps as CoreSelectProps, SelectValueChangeEvent } from '@timui/core'
import { createTimEvent, selectCollection, selectConnect, selectMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export type SelectItemData = {
  label: string
  value: string
  disabled?: boolean
}

export type SelectProps = {
  id?: string
  collection?: ReturnType<typeof selectCollection<SelectItemData>>
  value?: string
  defaultValue?: string
  disabled?: boolean
  required?: boolean
  name?: string
  open?: boolean
  defaultOpen?: boolean
  onValueChange?: (event: SelectValueChangeEvent) => void
  onOpenChange?: CoreSelectProps['onOpenChange']
  children?: React.ReactNode
}

export function useSelect(props: SelectProps) {
  const generatedId = React.useId()
  const selectId = props.id ?? generatedId
  const value = props.value !== undefined ? [props.value] : undefined
  const defaultValue = props.value === undefined && props.defaultValue !== undefined
    ? [props.defaultValue]
    : undefined
  const service = useMachine(selectMachine, {
    id: selectId,
    collection: props.collection ?? selectCollection<SelectItemData>({ items: [] }),
    value,
    defaultValue,
    disabled: props.disabled,
    required: props.required,
    name: props.name,
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
    onValueChange(details) {
      props.onValueChange?.(
        createTimEvent('change', selectId, { value: details.value }) as SelectValueChangeEvent
      )
    },
  })

  return React.useMemo(() => selectConnect(service, normalizeProps), [service])
}

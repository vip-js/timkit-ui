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
  value?: string | null
  defaultValue?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  name?: string
  open?: boolean | null
  defaultOpen?: boolean
  onValueChange?: (event: SelectValueChangeEvent) => void
  onOpenChange?: CoreSelectProps['onOpenChange']
  placeholder?: string
  children?: React.ReactNode
}

export function useSelect(props: SelectProps) {
  const generatedId = React.useId()
  const selectId = props.id ?? generatedId
  const value =
    props.value === undefined ? undefined : props.value == null || props.value === '' ? [] : [props.value]
  const defaultValue = props.value === undefined && props.defaultValue !== undefined
    ? [props.defaultValue]
    : undefined
  const [, setPhase] = React.useState(0)
  const service = useMachine(selectMachine, {
    id: selectId,
    collection: props.collection ?? selectCollection<SelectItemData>({ items: [] }),
    ...(value === undefined ? { defaultValue } : { value }),
    disabled: props.disabled || undefined,
    readOnly: props.readOnly || undefined,
    required: props.required,
    name: props.name,
    ...(props.open === undefined ? { defaultOpen: props.defaultOpen } : { open: props.open === true }),
    onOpenChange(details) {
      setPhase((phase) => phase + 1)
      props.onOpenChange?.(details)
    },
    onValueChange(details) {
      setPhase((phase) => phase + 1)
      props.onValueChange?.(
        createTimEvent('change', selectId, { value: details.value }) as SelectValueChangeEvent
      )
    },
  })
  void setPhase

  return selectConnect(service, normalizeProps)
}

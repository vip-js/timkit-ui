import * as React from 'react'
import { tabsConnect, tabsMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseTabsProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onFocusChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  activationMode?: 'manual' | 'automatic'
  loopFocus?: boolean
  composite?: boolean
  deselectable?: boolean
  id?: string
}

export function useTabs(props: UseTabsProps) {
  const generatedId = React.useId()
  const service = useMachine(tabsMachine, {
    id: props.id ?? generatedId,
    value: props.value,
    defaultValue: props.defaultValue,
    orientation: props.orientation,
    activationMode: props.activationMode,
    loopFocus: props.loopFocus,
    composite: props.composite,
    deselectable: props.deselectable,
    onValueChange: (details) => props.onValueChange?.(details.value),
    onFocusChange: (details) => props.onFocusChange?.(details.focusedValue),
  })
  const api = React.useMemo(() => tabsConnect(service, normalizeProps), [service])

  return api
}

import * as React from 'react'
import { tabsConnect, tabsMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseTabsProps {
  value?: string | null
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
  const [, setPhase] = React.useState(0)
  const service = useMachine(tabsMachine, {
    id: props.id ?? generatedId,
    ...(props.value === undefined ? { defaultValue: props.defaultValue } : { value: props.value ?? '' }),
    orientation: props.orientation,
    activationMode: props.activationMode ?? 'automatic',
    loopFocus: props.loopFocus,
    composite: props.composite,
    deselectable: props.deselectable,
    onValueChange: (details) => {
      setPhase((phase) => phase + 1)
      props.onValueChange?.(details.value)
    },
    onFocusChange: (details) => props.onFocusChange?.(details.focusedValue),
  })
  void setPhase

  return tabsConnect(service, normalizeProps)
}

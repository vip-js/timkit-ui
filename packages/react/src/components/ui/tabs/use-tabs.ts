import * as React from 'react'
import { tabsConnect, tabsMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseTabsProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  id?: string
}

export function useTabs(props: UseTabsProps) {
  const generatedId = React.useId()
  const service = useMachine(tabsMachine, {
    id: props.id ?? generatedId,
    value: props.value,
    defaultValue: props.defaultValue,
    orientation: props.orientation,
    onValueChange: (details) => props.onValueChange?.(details.value),
  })
  const api = React.useMemo(() => tabsConnect(service, normalizeProps), [service])

  return api
}

'use client'

import * as React from 'react'
import { restoreFocus } from '@timui/core'

export function useReturnFocus(open: boolean) {
  const trigger = React.useRef<HTMLElement | null>(null)
  const wasOpen = React.useRef(open)

  React.useEffect(() => {
    if (wasOpen.current && !open) restoreFocus(trigger.current)
    wasOpen.current = open
  }, [open])

  return React.useCallback((node: HTMLElement | null) => {
    trigger.current = node
  }, [])
}

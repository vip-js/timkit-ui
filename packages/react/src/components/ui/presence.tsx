'use client'

import * as React from 'react'
import { cn } from '@timui/core'
import * as presence from '@zag-js/presence'
import { normalizeProps, useMachine } from '@zag-js/react'

interface PresenceProps extends React.HTMLAttributes<HTMLDivElement> {
  present: boolean
  lazyMount?: boolean
  unmountOnExit?: boolean
}

const Presence = React.forwardRef<HTMLDivElement, PresenceProps>(
  ({ className, present, lazyMount = false, unmountOnExit = false, ...props }, ref) => {
    const service = useMachine(presence.machine as never, {
      present,
    })
    const api = React.useMemo(() => presence.connect(service as never, normalizeProps), [service])

    const isUnmounted = !api.present && !present && unmountOnExit
    const isHidden = !api.present && !present && !unmountOnExit

    if (lazyMount && !api.present && !present) {
      return null
    }

    if (isUnmounted) return null

    return (
      <div
        ref={ref}
        data-slot="presence"
        data-state={present ? 'open' : 'closed'}
        hidden={isHidden}
        className={cn(className)}
        {...props}
      />
    )
  }
)
Presence.displayName = 'Presence'

export { Presence }
export type { PresenceProps }

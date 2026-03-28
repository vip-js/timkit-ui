'use client'

import * as React from 'react'
import { cn } from '@timui/core'

interface PresenceProps extends React.HTMLAttributes<HTMLDivElement> {
  present: boolean
  lazyMount?: boolean
  unmountOnExit?: boolean
}

const Presence = React.forwardRef<HTMLDivElement, PresenceProps>(
  ({ className, present, lazyMount = false, unmountOnExit = false, ...props }, ref) => {
    if (lazyMount && !present) {
      return null
    }

    if (unmountOnExit && !present) return null

    return (
      <div
        ref={ref}
        data-slot="presence"
        data-state={present ? 'open' : 'closed'}
        hidden={!present && !unmountOnExit}
        className={cn(className)}
        {...props}
      />
    )
  }
)
Presence.displayName = 'Presence'

export { Presence }
export type { PresenceProps }

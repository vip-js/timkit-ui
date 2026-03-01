import * as React from 'react'
import * as presence from '@zag-js/presence'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import { Slot } from '../ui/slot'

export interface PresenceProps extends React.HTMLAttributes<HTMLElement> {
    present: boolean
    lazyMount?: boolean
    unmountOnExit?: boolean
    asChild?: boolean
}

export const Presence = React.forwardRef<HTMLElement, PresenceProps>(
    ({ present, lazyMount, unmountOnExit, asChild, ...props }, ref) => {
        const machine = useMachine(presence.machine, { present })
        const api = presence.connect(machine, normalizeProps)

        const [wasEverPresent, setWasEverPresent] = React.useState(false)

        React.useEffect(() => {
            if (api.present) setWasEverPresent(true)
        }, [api.present])

        if (lazyMount && !wasEverPresent) return null
        if (unmountOnExit && !api.present && !wasEverPresent) return null
        if (unmountOnExit && !api.present && wasEverPresent && !machine.state.matches('animating')) return null
        // Wait, Zag handles `api.present` returning true while animating out!
        // So we just check `if (unmountOnExit && !api.present) return null`

        if (unmountOnExit && !api.present) return null

        const Comp = asChild ? Slot : 'div'

        return (
            <Comp
                ref={(node) => {
                    api.setNode(node)
                    if (typeof ref === 'function') ref(node)
                    else if (ref) (ref as React.MutableRefObject<any>).current = node
                }}
                {...props}
                hidden={!api.present && !unmountOnExit ? true : props.hidden}
            />
        )
    }
)

Presence.displayName = 'Presence'

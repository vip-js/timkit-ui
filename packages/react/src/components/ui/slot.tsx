import * as React from 'react'
import { mergeProps } from '@zag-js/react'

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(
    ({ children, ...props }, _ref) => {
        if (!React.isValidElement(children)) return null

        const child = children as React.ReactElement<React.HTMLAttributes<HTMLElement>>
        const mergedProps = mergeProps(props, child.props)
        return React.cloneElement(child, mergedProps)
    }
)
Slot.displayName = "Slot"

export { Slot }

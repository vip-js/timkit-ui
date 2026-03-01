import * as React from 'react'

import { mergeProps } from '@zag-js/react'

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(
    ({ children, ...props }, ref) => {
        if (React.isValidElement(children)) {
            const childProps = (children as React.ReactElement<Record<string, unknown>>).props
            const childRef = (children as unknown as { ref?: React.Ref<unknown> }).ref
            const mergedRef = (node: unknown) => {
                if (typeof ref === 'function') ref(node as HTMLElement)
                else if (ref) (ref as React.MutableRefObject<unknown>).current = node
                if (typeof childRef === 'function') childRef(node)
                else if (childRef) (childRef as React.MutableRefObject<unknown>).current = node
            }
            return React.cloneElement(children, {
                ...mergeProps(props, childProps),
                ref: mergedRef,
            } as React.HTMLAttributes<HTMLElement> & { ref: typeof mergedRef })
        }
        return null
    }
)
Slot.displayName = 'Slot'

export { Slot }

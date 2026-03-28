'use client'

import * as React from 'react'
import { mergeProps } from '@zag-js/react'

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

type SlotChildProps = React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>

const setRef = <T,>(ref: React.Ref<T> | undefined, value: T | null) => {
  if (!ref) return
  if (typeof ref === 'function') {
    ref(value)
    return
  }
  ;(ref as React.MutableRefObject<T | null>).current = value
}

const composeRefs = <T,>(...refs: Array<React.Ref<T> | undefined>) => {
  return (value: T | null) => {
    refs.forEach((ref) => setRef(ref, value))
  }
}

const getElementRef = (element: React.ReactElement) => {
  return (element as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(({ children, ...props }, forwardedRef) => {
  if (!React.isValidElement(children)) {
    return null
  }

  const child = children as React.ReactElement<SlotChildProps>
  const mergedProps = mergeProps(props, child.props) as SlotChildProps
  const childRef = getElementRef(child)
  const slottedProps: SlotChildProps = {
    ...mergedProps,
    ref: composeRefs(forwardedRef, childRef),
  }

  return React.cloneElement(child, slottedProps)
})
Slot.displayName = 'Slot'

export { Slot }

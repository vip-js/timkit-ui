'use client'

import * as React from 'react'
import { collapsibleConnect, collapsibleMachine } from '@timui/core'
import { cn } from '@timui/core'
import { mergeProps } from '@zag-js/react'
import { useCollapsibleContext, CollapsibleProvider } from './collapsible/use-collapsible-context'
import { useCollapsible } from './collapsible/use-collapsible'

import { Slot } from './slot'

// Context is imported from ./collapsible/use-collapsible-context

const Collapsible = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    disabled?: boolean
  }
>(({ className, ...props }, ref) => {
  const api = useCollapsible(props)

  const rootProps = api.getRootProps()
  const mergedProps = mergeProps(rootProps, props) as React.HTMLAttributes<HTMLDivElement>
  const { className: mergedClassName, ...restProps } = mergedProps

  return (
    <CollapsibleProvider value={api}>
      <div
        ref={ref}
        data-slot="collapsible"
        className={cn(className, mergedClassName)}
        {...restProps}
      />
    </CollapsibleProvider>
  )
})
Collapsible.displayName = 'Collapsible'

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const api = useCollapsibleContext()
  const Comp = asChild ? Slot : 'button'
  const triggerProps = api.getTriggerProps()

  return (
    <Comp
      ref={ref}
      data-slot="collapsible-trigger"
      {...mergeProps(triggerProps, props)}
      className={cn(className)}
    />
  )
})
CollapsibleTrigger.displayName = 'CollapsibleTrigger'

const CollapsibleContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const api = useCollapsibleContext()
    const contentProps = api.getContentProps()
    const mergedProps = mergeProps(contentProps, props)
    const { className: mergedClassName, ...restProps } = mergedProps

    return (
      <div
        ref={ref}
        data-slot="collapsible-content"
        className={cn('overflow-hidden', className, mergedClassName)}
        {...restProps}
      >
        {children}
      </div>
    )
  }
)
CollapsibleContent.displayName = 'CollapsibleContent'

export { Collapsible, CollapsibleContent, CollapsibleTrigger }

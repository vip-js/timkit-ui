'use client'

import * as React from 'react'
import { cn, collapsibleConnect, collapsibleMachine } from '@timui/core'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'

import { Slot } from './slot'

const CollapsibleContext = React.createContext<{
  api: ReturnType<typeof collapsibleConnect>
} | null>(null)

function useCollapsible() {
  const context = React.useContext(CollapsibleContext)
  if (!context) {
    throw new Error('Collapsible components must be used within Collapsible')
  }
  return context
}

const Collapsible = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    disabled?: boolean
  }
>(({ className, open, defaultOpen, onOpenChange, disabled, ...props }, ref) => {
  const service = useMachine(collapsibleMachine, {
    id: React.useId(),
    open,
    defaultOpen,
    disabled,
    onOpenChange(details) {
      onOpenChange?.(details.open)
    },
  })
  const api = React.useMemo(() => collapsibleConnect(service, normalizeProps), [service])
  const rootProps = api.getRootProps()
  const mergedProps = mergeProps(rootProps, props)

  return (
    <CollapsibleContext.Provider value={{ api }}>
      <div ref={ref} data-slot="collapsible" {...mergedProps} className={cn(className)} />
    </CollapsibleContext.Provider>
  )
})
Collapsible.displayName = 'Collapsible'

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const { api } = useCollapsible()
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
    const { api } = useCollapsible()
    const contentProps = api.getContentProps()
    const mergedProps = mergeProps(contentProps, props)

    return (
      <div
        ref={ref}
        data-slot="collapsible-content"
        className={cn('overflow-hidden', className)}
        {...mergedProps}
      >
        {children}
      </div>
    )
  }
)
CollapsibleContent.displayName = 'CollapsibleContent'

export { Collapsible, CollapsibleContent, CollapsibleTrigger }

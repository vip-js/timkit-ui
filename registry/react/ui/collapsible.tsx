'use client'

import * as React from 'react'
import * as collapsible from '@zag-js/collapsible'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'

import { cva } from '../lib/cva'
import { cn } from '../lib/utils'

const collapsibleContentVariants = cva(
  'overflow-hidden transition-all data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up'
)

const CollapsibleContext = React.createContext<{
  api: collapsible.Api
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
  const service: collapsible.Service = useMachine(collapsible.machine, {
    id: React.useId(),
    open,
    defaultOpen,
    disabled,
    onOpenChange: (details) => onOpenChange?.(details.open),
  })
  const api = collapsible.connect(service, normalizeProps)
  const rootProps = api.getRootProps()
  const mergedProps = mergeProps(rootProps, props) as React.HTMLAttributes<HTMLDivElement>
  const { className: mergedClassName, ...restProps } = mergedProps

  return (
    <CollapsibleContext.Provider value={{ api }}>
      <div ref={ref} className={cn(className, mergedClassName)} {...restProps} />
    </CollapsibleContext.Provider>
  )
})
Collapsible.displayName = 'Collapsible'

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { api } = useCollapsible()
  const triggerProps = api.getTriggerProps()
  const mergedProps = mergeProps(triggerProps, props)

  return <button ref={ref} className={cn(className)} {...mergedProps} />
})
CollapsibleTrigger.displayName = 'CollapsibleTrigger'

const CollapsibleContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { api } = useCollapsible()
    const contentProps = api.getContentProps()
    const mergedProps = mergeProps(contentProps, props)
    const { className: mergedClassName, ...restProps } = mergedProps

    return (
      <div
        ref={ref}
        className={cn(collapsibleContentVariants(), className, mergedClassName)}
        {...restProps}
      >
        {children}
      </div>
    )
  }
)
CollapsibleContent.displayName = 'CollapsibleContent'

export { Collapsible, CollapsibleTrigger, CollapsibleContent }

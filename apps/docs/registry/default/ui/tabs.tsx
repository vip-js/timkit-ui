'use client'

import * as React from 'react'
import { cn, tabsConnect, tabsMachine } from '@timui/core'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'

import { Slot } from './slot'

const TabsContext = React.createContext<{
  api: ReturnType<typeof tabsConnect>
} | null>(null)

function useTabs() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within Tabs')
  }
  return context
}

const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    orientation?: 'horizontal' | 'vertical'
  }
>(({ className, value, defaultValue, onValueChange, orientation, ...props }, ref) => {
  const service = useMachine(tabsMachine, {
    id: React.useId(),
    value,
    defaultValue,
    orientation,
    onValueChange: (details) => onValueChange?.(details.value),
  })
  const api = React.useMemo(() => tabsConnect(service, normalizeProps), [service])
  const contextValue = React.useMemo(() => ({ api }), [api])
  const rootProps = api.getRootProps()
  const mergedProps = mergeProps(rootProps, props)

  return (
    <TabsContext.Provider value={contextValue}>
      <div ref={ref} data-slot="tabs" {...mergedProps} className={cn(className)} />
    </TabsContext.Provider>
  )
})
Tabs.displayName = 'Tabs'

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { api } = useTabs()
    const listProps = api.getListProps()
    const mergedProps = mergeProps(listProps, props)
    const { className: mergedClassName, ...restProps } = mergedProps
    return (
      <div
        ref={ref}
        data-slot="tabs-list"
        className={cn(
          'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
          className,
          mergedClassName
        )}
        {...restProps}
      />
    )
  }
)
TabsList.displayName = 'TabsList'

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string; asChild?: boolean }
>(({ className, value, asChild = false, ...props }, ref) => {
  const { api } = useTabs()
  const Comp = asChild ? Slot : 'button'
  const triggerProps = api.getTriggerProps({ value, disabled: props.disabled })
  const mergedProps = mergeProps(triggerProps, props)
  const { className: mergedClassName, type: mergedType, ...restProps } = mergedProps
  const finalType = asChild ? mergedType : (mergedType ?? 'button')

  return (
    <Comp
      ref={ref}
      data-slot="tabs-trigger"
      type={finalType}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        className,
        mergedClassName
      )}
      {...restProps}
    />
  )
})
TabsTrigger.displayName = 'TabsTrigger'

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const { api } = useTabs()
  const isSelected = api.value === value

  if (!isSelected) return null

  const contentProps = api.getContentProps({ value })
  const mergedProps = mergeProps(contentProps, props)
  const { className: mergedClassName, ...restProps } = mergedProps

  return (
    <div
      ref={ref}
      data-slot="tabs-content"
      role="tabpanel"
      data-state={isSelected ? 'active' : 'inactive'}
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
        mergedClassName
      )}
      {...restProps}
    />
  )
})
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }

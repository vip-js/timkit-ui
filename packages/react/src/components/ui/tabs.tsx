'use client'

import * as React from 'react'
import { cn, tabsContentVariants, tabsListVariants, tabsTriggerVariants } from '@timui/core'
import { mergeProps } from '@zag-js/react'

import { Slot } from './slot'
import { useTabs, type UseTabsProps } from './tabs/use-tabs'
import { TabsProvider, useTabsContext } from './tabs/use-tabs-context'

const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    orientation?: 'horizontal' | 'vertical'
    id?: string
  }
>(({ className, value, defaultValue, onValueChange, orientation, id, ...props }, ref) => {
  const api = useTabs({ value, defaultValue, onValueChange, orientation, id })
  const rootProps = api.getRootProps()
  const mergedProps = mergeProps(rootProps, props) as React.HTMLAttributes<HTMLDivElement>
  const { className: mergedClassName, ...restProps } = mergedProps

  return (
    <TabsProvider value={api}>
      <div ref={ref} data-slot="tabs" className={cn(className, mergedClassName)} {...restProps} />
    </TabsProvider>
  )
})
Tabs.displayName = 'Tabs'

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const api = useTabsContext()
    const listProps = api.getListProps()
    const mergedProps = mergeProps(listProps, props) as React.HTMLAttributes<HTMLDivElement>
    const { className: mergedClassName, ...restProps } = mergedProps
    return (
      <div
        ref={ref}
        data-slot="tabs-list"
        className={cn(tabsListVariants(), className, mergedClassName)}
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
  const api = useTabsContext()
  const Comp = asChild ? Slot : 'button'
  const triggerProps = api.getTriggerProps({ value, disabled: props.disabled })
  const mergedProps = mergeProps(
    triggerProps,
    props
  ) as React.ButtonHTMLAttributes<HTMLButtonElement>
  const { className: mergedClassName, type: mergedType, ...restProps } = mergedProps
  const finalType = asChild ? mergedType : (mergedType ?? 'button')

  return (
    <Comp
      ref={ref}
      data-slot="tabs-trigger"
      type={finalType}
      className={cn(tabsTriggerVariants(), className, mergedClassName)}
      {...restProps}
    />
  )
})
TabsTrigger.displayName = 'TabsTrigger'

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const api = useTabsContext()
  const isSelected = api.value === value

  if (!isSelected) return null

  const contentProps = api.getContentProps({ value })
  const mergedProps = mergeProps(contentProps, props) as React.HTMLAttributes<HTMLDivElement>
  const { className: mergedClassName, ...restProps } = mergedProps

  return (
    <div
      ref={ref}
      data-slot="tabs-content"
      role="tabpanel"
      data-state={isSelected ? 'active' : 'inactive'}
      className={cn(tabsContentVariants(), className, mergedClassName)}
      {...restProps}
    />
  )
})
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }

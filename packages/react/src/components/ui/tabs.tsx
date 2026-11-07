'use client'

import * as React from 'react'
import { cn, tabsContentVariants, tabsListVariants, tabsTriggerVariants } from '@timui/core'
import { mergeProps } from '@zag-js/react'

import { Slot } from './slot'
import { useTabs, type UseTabsProps } from './tabs/use-tabs'
import { TabsDisabledProvider, TabsProvider, useTabsContext, useTabsDisabled } from './tabs/use-tabs-context'

const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string | null
    defaultValue?: string
    onValueChange?: (value: string) => void
    onFocusChange?: (value: string) => void
    orientation?: 'horizontal' | 'vertical'
    activationMode?: 'manual' | 'automatic'
    disabled?: boolean
    loopFocus?: boolean
    composite?: boolean
    deselectable?: boolean
    id?: string
  }
>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      onFocusChange,
      orientation,
      activationMode,
      disabled = false,
      loopFocus,
      composite,
      deselectable,
      id,
      ...props
    },
    ref
  ) => {
    const api = useTabs({
      value,
      defaultValue,
      onValueChange,
      onFocusChange,
      orientation,
      activationMode,
      loopFocus,
      composite,
      deselectable,
      id,
    })
    const rootProps = api.getRootProps()
    const mergedProps = mergeProps(rootProps, props) as React.HTMLAttributes<HTMLDivElement>
    const { className: mergedClassName, ...restProps } = mergedProps

    return (
      <TabsDisabledProvider value={disabled}>
        <TabsProvider value={api}>
          <div
            ref={ref}
            data-slot="tabs"
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? '' : undefined}
            className={cn(className, mergedClassName)}
            {...restProps}
          />
        </TabsProvider>
      </TabsDisabledProvider>
    )
  }
)
Tabs.displayName = 'Tabs'

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, 'aria-label': ariaLabel, ...props }, ref) => {
    const api = useTabsContext()
    const groupDisabled = useTabsDisabled()
    const listProps = api.getListProps()
    const mergedProps = mergeProps(listProps, props) as React.HTMLAttributes<HTMLDivElement>
    const { className: mergedClassName, onKeyDown: listOnKeyDown, ...restProps } = mergedProps
    const triggers = React.Children.toArray(children).filter(React.isValidElement)
    const selected = api.value == null || api.value === '' ? -1 : triggers.findIndex((child) => (child.props as { value?: string }).value === api.value)
    const tabStatus = selected < 0 ? '' : `Tab ${selected + 1} of ${triggers.length}`
    return (
      <>
      {tabStatus ? <p role="status">{tabStatus}</p> : null}
      <div
        ref={ref}
        data-slot="tabs-list"
        className={cn(tabsListVariants(), className, mergedClassName)}
        {...restProps}
        aria-label={typeof ariaLabel === 'string' && ariaLabel ? ariaLabel : 'Tabs'}
        onKeyDown={(event) => {
          if (groupDisabled) {
            event.preventDefault()
            return
          }
          listOnKeyDown?.(event)
          const horizontal = event.currentTarget.getAttribute('data-orientation') !== 'vertical'
          const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown'
          const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp'
          const triggers = [...event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])')]
          if (event.key === 'Home' || event.key === 'End') {
            const edge = event.key === 'Home' ? triggers[0] : triggers[triggers.length - 1]
            const value = edge?.dataset.value
            if (value) api.setValue(value)
            return
          }
          if (event.key !== nextKey && event.key !== prevKey) return
          const selected = event.currentTarget.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
          if (!selected || triggers.length === 0) return
          const index = triggers.indexOf(selected)
          if (index < 0) return
          const delta = event.key === nextKey ? 1 : -1
          const next = triggers[(index + delta + triggers.length) % triggers.length]
          const value = next?.dataset.value
          if (!value || value === selected.dataset.value) return
          api.setValue(value)
        }}
      >
        {children}
      </div>
      </>
    )
  }
)
TabsList.displayName = 'TabsList'

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string; asChild?: boolean }
>(({ className, value, asChild = false, ...props }, ref) => {
  const api = useTabsContext()
  const groupDisabled = useTabsDisabled()
  const Comp = asChild ? Slot : 'button'
  const itemDisabled = groupDisabled || Boolean(props.disabled)
  const triggerProps = api.getTriggerProps({ value, disabled: itemDisabled })
  const mergedProps = mergeProps(
    triggerProps,
    props,
    itemDisabled
      ? {
          disabled: true,
          onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault()
          },
        }
      : {}
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

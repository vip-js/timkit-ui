'use client'

import * as React from 'react'
import * as tabs from '@zag-js/tabs'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import { cva } from '../lib/cva'
import { cn } from '../lib/utils'

const tabsListVariants = cva(
    'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground'
)
const tabsTriggerVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm'
)
const tabsContentVariants = cva(
    'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
)

const TabsContext = React.createContext<{
    api: tabs.Api
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
        onValueChange?: (value: any) => void
        orientation?: "horizontal" | "vertical"
    }
>(({ className, value, defaultValue, onValueChange, orientation = "horizontal", ...props }, ref) => {
    const service: tabs.Service = useMachine(tabs.machine, {
        id: React.useId(),
        value,
        defaultValue,
        orientation,
        onValueChange: (details: { value: string }) => onValueChange?.(details.value),
    })
    const api = tabs.connect(service, normalizeProps)
    const rootProps = api.getRootProps()
    const mergedProps = mergeProps(rootProps, props) as React.HTMLAttributes<HTMLDivElement>
    const { className: mergedClassName, ...restProps } = mergedProps

    return (
        <TabsContext.Provider value={{ api }}>
            <div
                ref={ref}
                className={cn(className, mergedClassName)}
                {...restProps}
            />
        </TabsContext.Provider>
    )
})
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { api } = useTabs()
    const listProps = api.getListProps()
    const mergedProps = mergeProps(listProps, props)
    const { className: mergedClassName, ...restProps } = mergedProps
    return (
        <div
            ref={ref}
            className={cn(tabsListVariants(), className, mergedClassName)}
            {...restProps}
        />
    )
})
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, disabled, ...props }, ref) => {
    const { api } = useTabs()
    const triggerProps = api.getTriggerProps({ value, disabled })
    const mergedProps = mergeProps(triggerProps, props)
    const { className: mergedClassName, ...restProps } = mergedProps

    return (
        <button
            ref={ref}
            className={cn(tabsTriggerVariants(), className, mergedClassName)}
            {...restProps}
        />
    )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
    const { api } = useTabs()
    const contentProps = api.getContentProps({ value })
    const mergedProps = mergeProps(contentProps, props)
    const { className: mergedClassName, ...restProps } = mergedProps

    return (
        <div
            ref={ref}
            className={cn(tabsContentVariants(), className, mergedClassName)}
            {...restProps}
        />
    )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }

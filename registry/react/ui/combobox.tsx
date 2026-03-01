'use client'

import * as React from 'react'
import { cva } from '../lib/cva'
import { cn } from '../lib/utils'
import * as combobox from '@zag-js/combobox'
import { mergeProps, normalizeProps, useMachine, Portal } from '@zag-js/react'


const comboboxRootVariants = cva('flex flex-col gap-1')
const comboboxControlVariants = cva(
    'flex items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-within:outline-none focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
)
const comboboxInputVariants = cva('flex-1 bg-transparent outline-none placeholder:text-muted-foreground')
const comboboxContentVariants = cva(
    'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md'
)
const comboboxListVariants = cva('max-h-60 overflow-y-auto p-1')
const comboboxItemVariants = cva(
    'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
)
const comboboxItemIndicatorVariants = cva(
    'absolute left-2 flex h-3.5 w-3.5 items-center justify-center'
)
const comboboxItemTextVariants = cva('ps-6')
const comboboxLabelVariants = cva('px-2 py-1.5 text-sm font-semibold')
const comboboxGroupLabelVariants = cva('px-2 py-1.5 text-xs font-medium text-muted-foreground')
const comboboxEmptyVariants = cva('py-6 text-center text-sm text-muted-foreground')

const ComboboxContext = React.createContext<combobox.Api | null>(null)

interface ComboboxProps {
    children?: React.ReactNode
    items?: any[]
    collection?: any
    id?: string
    name?: string
    placeholder?: string
    onValueChange?: (details: any) => void
    onOpenChange?: (details: any) => void
    disabled?: boolean
    className?: string
}

function useCombobox(): combobox.Api {
    const context = React.useContext(ComboboxContext)
    if (!context) {
        throw new Error('useCombobox must be used within a Combobox')
    }
    return context
}

const Combobox = ({ className, children, items, collection, ...props }: ComboboxProps) => {
    const generatedId = React.useId()

    const service: combobox.Service = useMachine(combobox.machine, {
        id: props.id ?? generatedId,
        collection: collection || { items: items || [], itemToString: (item: any) => item.label || item, itemToValue: (item: any) => item.value || item, count: items?.length || 0 }, // Naive manual collection
        onValueChange: props.onValueChange,
        onOpenChange: props.onOpenChange,
        disabled: props.disabled,
    })
    const api = combobox.connect(service, normalizeProps)

    return (
        <ComboboxContext.Provider value={api}>
            <div {...api.getRootProps()} className={cn(comboboxRootVariants(), className)}>
                {children}
            </div>
        </ComboboxContext.Provider>
    )
}

function ComboboxLabel({ className, ...props }: React.ComponentProps<'label'>) {
    const api = useCombobox()
    return (
        <label {...api.getLabelProps()} className={cn(comboboxLabelVariants(), className)} {...props} />
    )
}

function ComboboxControl({ className, children, ...props }: React.ComponentProps<'div'>) {
    const api = useCombobox()
    return (
        <div
            {...api.getControlProps()}
            className={cn(comboboxControlVariants(), className)}
            {...props}
        >
            {children}
        </div>
    )
}

function ComboboxInput({ className, ...props }: React.ComponentProps<'input'>) {
    const api = useCombobox()
    return (
        <input
            {...api.getInputProps()}
            className={cn(comboboxInputVariants(), className)}
            {...props}
        />
    )
}

function ComboboxContent({ className, children, ...props }: React.ComponentProps<'div'>) {
    const api = useCombobox()
    if (!api.open) return null
    const positionerProps = api.getPositionerProps()
    const contentProps = api.getContentProps()

    // Zag Combobox handles positioning.
    return (
        <div {...positionerProps} style={{ ...positionerProps.style, zIndex: 50 }}>
            <div
                {...contentProps}
                className={cn(comboboxContentVariants(), className)}
                {...props}
            >
                {children}
            </div>
        </div>
    )
}

function ComboboxList({ className, children, ...props }: React.ComponentProps<'div'>) {
    const api = useCombobox()
    return (
        <div {...api.getListProps()} className={cn(comboboxListVariants(), className)} {...props}>
            {children}
        </div>
    )
}

function ComboboxItem({ item, className, children, ...props }: { item: any } & React.ComponentProps<'div'>) {
    const api = useCombobox()
    const itemState = api.getItemState({ item })

    return (
        <div
            {...api.getItemProps({ item })}
            className={cn(comboboxItemVariants(), className)}
            data-highlighted={itemState.highlighted || undefined}
            data-selected={itemState.selected || undefined}
            {...props}
        >
            <span className={comboboxItemIndicatorVariants()}>
                {itemState.selected ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                ) : null}
            </span>
            <span className={comboboxItemTextVariants()}>
                {children ?? item.label ?? item.value ?? item}
            </span>
        </div>
    )
}

function ComboboxGroup({ id, className, children, ...props }: { id: string } & React.ComponentProps<'div'>) {
    const api = useCombobox()
    return (
        <div
            {...api.getItemGroupProps({ id })}
            className={cn(className)}
            {...props}
        >
            {children}
        </div>
    )
}

function ComboboxGroupLabel({ htmlFor, className, ...props }: { htmlFor: string } & React.ComponentProps<'div'>) {
    const api = useCombobox()
    return (
        <div
            {...api.getItemGroupLabelProps({ htmlFor })}
            className={cn(comboboxGroupLabelVariants(), className)}
            {...props}
        >
            {props.children}
        </div>
    )
}

function ComboboxEmpty({ className, children, ...props }: React.ComponentProps<'div'>) {
    return (
        <div className={cn(comboboxEmptyVariants(), className)} {...props}>
            {children}
        </div>
    )
}

export {
    Combobox,
    ComboboxLabel,
    ComboboxControl,
    ComboboxInput,
    ComboboxContent,
    ComboboxList,
    ComboboxItem,
    ComboboxGroup,
    ComboboxGroupLabel,
    ComboboxEmpty,
    useCombobox,
}

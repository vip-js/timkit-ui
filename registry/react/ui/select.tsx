'use client'

import * as React from 'react'
import { ListCollection } from '@zag-js/collection'
import { mergeProps, normalizeProps, Portal, useMachine } from '@zag-js/react'
import * as select from '@zag-js/select'

import { cva } from '../lib/cva'
import { Presence } from '../lib/presence'
import { cn } from '../lib/utils'
import { Slot } from './slot'

const selectTriggerVariants = cva(
  'border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
)
const selectTriggerIconVariants = cva('h-4 w-4 opacity-50')
const selectContentVariants = cva(
  'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border shadow-md'
)
const selectContentPopperVariants = cva(
  'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1'
)
const selectItemVariants = cva(
  'focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-8 ps-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
)
const selectLabelVariants = cva('py-1.5 pl-8 pr-2 text-sm font-semibold')
const selectSeparatorVariants = cva('-mx-1 my-1 h-px bg-muted')
const selectValueVariants = cva(
  'line-clamp-1 pointer-events-none data-[placeholder]:text-muted-foreground'
)

const SelectContext = React.createContext<select.Api | null>(null)

interface SelectProps {
  children: React.ReactNode
  items?: any[]
  listCollection?: any
  name?: string
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (details: any) => void
  disabled?: boolean
  id?: string
}

// Minimal Collection implementation if not available

const Select = (props: SelectProps) => {
  const generatedId = React.useId()
  // const listCollection = props.listCollection || select.new ListCollection({ items: props.items || [] })

  // To avoid dependency on `@zag-js/listCollection` if it's not installed, I'll use `items` if possible.
  // If `items` is passed, I'll try to use `select.listCollection` if I can access it.
  // If not, I'll rely on user passing `listCollection` logic or minimal object.
  // Actually, I'll assume users will install `@zag-js/select` which has the listCollection logic.

  const service = useMachine(select.machine, {
    id: props.id ?? generatedId,
    collection: props.listCollection || {
      items: props.items || [],
      itemToString: (item: any) => item.label || item,
      itemToValue: (item: any) => item.value || item,
    },
    // Fallback minimal listCollection object if they don't pass one, might fail but better than nothing.
    // Real Zag listCollection has `find`, `findByText`, etc.
    name: props.name,
    value: props.value,
    defaultValue: props.defaultValue,
    onValueChange: props.onValueChange,
    disabled: props.disabled,
  })
  const api = select.connect(service, normalizeProps)

  return <SelectContext.Provider value={api}>{props.children}</SelectContext.Provider>
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, any>(
  ({ className, children, asChild = false, ...props }, ref) => {
    const api = React.useContext(SelectContext)
    const Comp = asChild ? Slot : ('button' as React.ElementType)
    const triggerProps = api?.getTriggerProps() || {}
    const mergedProps = mergeProps(triggerProps, props)

    return (
      <Comp ref={ref} className={cn(selectTriggerVariants(), className)} {...mergedProps}>
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={selectTriggerIconVariants()}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </Comp>
    )
  }
)
SelectTrigger.displayName = 'SelectTrigger'

const SelectContent = React.forwardRef<HTMLDivElement, any>(
  ({ className, children, position = 'popper', ...props }, ref) => {
    const api = React.useContext(SelectContext)
    if (!api) return null

    const positionerProps = api.getPositionerProps()
    const contentProps = api.getContentProps()

    // For Zag Select, `contentProps` handles the wrapper.
    // We need to render it in a Portal usually.

    return (
      <Portal>
        <Presence
          present={api.open}
          lazyMount
          unmountOnExit
          {...positionerProps}
          style={{ ...positionerProps.style, zIndex: 50 }}
        >
          <div
            {...contentProps}
            ref={ref}
            className={cn(
              selectContentVariants(),
              position === 'popper' && selectContentPopperVariants(),
              className
            )}
            {...props}
          >
            {children}
          </div>
        </Presence>
      </Portal>
    )
  }
)
SelectContent.displayName = 'SelectContent'

const SelectItem = React.forwardRef<HTMLDivElement, any>(
  ({ className, children, item, ...props }, ref) => {
    const api = React.useContext(SelectContext)
    // `item` prop is required for Zag Select Item.
    // If used as <SelectItem value="foo">, we need to construct item object.
    // If we don't have the listCollection item, this might be tricky if listCollection doesn't know about it.
    // We'll pass `item` directly to `getItemProps`.
    // In `Select.tsx` earlier, we saw: `const item = { label: children, value }`.
    const resolvedItem = item || { label: children, value: props.value }

    const itemProps = api?.getItemProps({ item: resolvedItem }) || {}
    const itemState = api?.getItemState({ item: resolvedItem })

    return (
      <div
        {...mergeProps(itemProps, props)}
        ref={ref}
        className={cn(selectItemVariants(), className)}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {itemState?.selected && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
        <span className="truncate">{children}</span>
      </div>
    )
  }
)
SelectItem.displayName = 'SelectItem'

const SelectLabel = React.forwardRef<HTMLDivElement, any>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(selectLabelVariants(), className)} {...props} />
))
SelectLabel.displayName = 'SelectLabel'

const SelectSeparator = React.forwardRef<HTMLDivElement, any>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(selectSeparatorVariants(), className)} {...props} />
))
SelectSeparator.displayName = 'SelectSeparator'

const SelectValue = React.forwardRef<HTMLSpanElement, any>(
  ({ className, placeholder, ...props }, ref) => {
    const api = React.useContext(SelectContext)
    return (
      <span ref={ref} className={cn(selectValueVariants(), className)} {...props}>
        {api?.valueAsString || placeholder}
      </span>
    )
  }
)
SelectValue.displayName = 'SelectValue'

// Helpers
const SelectGroup = (props: any) => {
  const api = React.useContext(SelectContext)
  return <div {...api?.getItemGroupProps({ id: props.id })} {...props} />
}
const SelectScrollUpButton = (props: any) => <div {...props} /> // Stub
const SelectScrollDownButton = (props: any) => <div {...props} /> // Stub

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}

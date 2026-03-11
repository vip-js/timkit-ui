'use client'

import * as React from 'react'
import * as menu from '@zag-js/menu'
import type { PositioningOptions } from '@zag-js/popper'
import { mergeProps, normalizeProps, Portal, useMachine } from '@zag-js/react'

import { createContext, type CreateContextReturn } from '../lib/create-context'
import { cva, type VariantProps } from '../lib/cva'
import { Presence } from '../lib/presence'
import { cn } from '../lib/utils'
import { Slot } from './slot'

const dropdownMenuContentVariants = cva(
  'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-md'
)
const dropdownMenuItemVariants = cva(
  'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 px-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
)
const dropdownMenuLabelVariants = cva('px-2 py-1.5 text-sm font-semibold')
const dropdownMenuSeparatorVariants = cva('bg-muted -mx-1 my-1 h-px')
const dropdownMenuShortcutVariants = cva('ms-auto text-xs tracking-widest opacity-60')
const dropdownMenuCheckboxItemVariants = cva(
  'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
)
const dropdownMenuRadioItemVariants = cva(
  'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
)
const dropdownMenuSubTriggerVariants = cva(
  'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent'
)
const dropdownMenuSubContentVariants = cva(
  'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
)

// Context
export const [DropdownMenuProvider, useDropdownMenuContext]: CreateContextReturn<menu.Api> =
  createContext<menu.Api>({
    name: 'DropdownMenuContext',
    hookName: 'useDropdownMenuContext',
    providerName: '<DropdownMenu />',
  })
export const [
  DropdownMenuRadioGroupProvider,
  useDropdownMenuRadioGroupContext,
]: CreateContextReturn<{
  value?: string
  onValueChange?: (value: string) => void
}> = createContext<{
  value?: string
  onValueChange?: (value: string) => void
}>({
  name: 'DropdownMenuRadioGroupContext',
  hookName: 'useDropdownMenuRadioGroupContext',
  providerName: '<DropdownMenuRadioGroup />',
})

type DropdownMenuProps = {
  children: React.ReactNode
  id?: string
  open?: boolean
  defaultOpen?: boolean
  closeOnSelect?: boolean
  loopFocus?: boolean
  positioning?: PositioningOptions
  onOpenChange?: (open: boolean) => void
}

const DropdownMenu = (props: DropdownMenuProps & Record<string, any>) => {
  const { children, onOpenChange, ...menuProps } = props
  const generatedId = React.useId()
  const service: menu.Service = useMachine(menu.machine, {
    id: menuProps.id ?? generatedId,
    open: menuProps.open,
    defaultOpen: menuProps.defaultOpen,
    closeOnSelect: menuProps.closeOnSelect,
    loopFocus: menuProps.loopFocus,
    positioning: menuProps.positioning,
    onOpenChange: (details) => onOpenChange?.(details.open),
  })
  const api = menu.connect(service, normalizeProps)

  return <DropdownMenuProvider value={api}>{children}</DropdownMenuProvider>
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, any>((props, ref) => {
  const api = useDropdownMenuContext()
  const { asChild, className, ...otherProps } = props
  const Comp = asChild ? Slot : 'button'
  const triggerProps = api.getTriggerProps()
  const mergedProps = mergeProps(triggerProps, otherProps)

  return (
    <Comp ref={ref} data-slot="dropdown-menu-trigger" className={cn(className)} {...mergedProps}>
      {props.children}
    </Comp>
  )
})
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

const DropdownMenuContent = React.forwardRef<HTMLDivElement, any>(
  ({ className, side = 'bottom', align = 'center', sideOffset = 4, ...props }, ref) => {
    const api = useDropdownMenuContext()
    const placement = align === 'center' ? side : `${side}-${align}`

    React.useEffect(() => {
      api.reposition({ placement: placement as any, gutter: sideOffset })
    }, [api, placement, sideOffset])

    if (typeof window === 'undefined') return null

    const positionerProps = api.getPositionerProps()
    const contentProps = api.getContentProps()

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
            data-slot="dropdown-menu-content"
            className={cn(dropdownMenuContentVariants(), className)}
            {...props}
          />
        </Presence>
      </Portal>
    )
  }
)
DropdownMenuContent.displayName = 'DropdownMenuContent'

const DropdownMenuItem = React.forwardRef<HTMLDivElement, any>(
  ({ className, inset, value, disabled, closeOnSelect, ...props }, ref) => {
    const api = useDropdownMenuContext()
    const generatedId = React.useId()
    const itemValue = value ?? generatedId
    const itemProps = api.getItemProps({ value: itemValue, disabled, closeOnSelect })
    const mergedProps = mergeProps(itemProps, props)

    return (
      <div
        {...mergedProps}
        ref={ref}
        data-slot="dropdown-menu-item"
        className={cn(dropdownMenuItemVariants(), inset && 'pl-8', className)}
      />
    )
  }
)
DropdownMenuItem.displayName = 'DropdownMenuItem'

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, any>(
  ({ className, ...props }, ref) => {
    const api = useDropdownMenuContext()
    const separatorProps = api.getSeparatorProps()
    return (
      <div
        {...mergeProps(separatorProps, props)}
        ref={ref}
        data-slot="dropdown-menu-separator"
        className={cn(dropdownMenuSeparatorVariants(), className)}
      />
    )
  }
)
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, any>(
  ({ className, inset, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="dropdown-menu-label"
        className={cn(dropdownMenuLabelVariants(), inset && 'pl-8', className)}
        {...props}
      />
    )
  }
)
DropdownMenuLabel.displayName = 'DropdownMenuLabel'

const DropdownMenuCheckboxItem = React.forwardRef<HTMLDivElement, any>(
  ({ className, children, checked, ...props }, ref) => {
    const api = useDropdownMenuContext()
    const generatedId = React.useId()
    const value = props.value ?? generatedId
    const optionProps = api.getOptionItemProps({
      type: 'checkbox',
      checked: !!checked,
      value,
      disabled: props.disabled,
      onCheckedChange: (next: boolean) => props.onCheckedChange?.(next),
    })

    return (
      <div
        {...mergeProps(optionProps, props)}
        ref={ref}
        data-slot="dropdown-menu-checkbox-item"
        className={cn(dropdownMenuCheckboxItemVariants(), className)}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {checked && (
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M3.5 8.5l3 3 6-7" />
            </svg>
          )}
        </span>
        {children}
      </div>
    )
  }
)
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem'

const DropdownMenuGroup = (props: any) => <div data-slot="dropdown-menu-group" {...props} />
const DropdownMenuPortal = (props: any) => <>{props.children}</>
const DropdownMenuSub = (props: any) => <div data-slot="dropdown-menu-sub" {...props} />
const DropdownMenuSubTrigger = (props: any) => {
  const { className, ...restProps } = props
  return (
    <div
      data-slot="dropdown-menu-sub-trigger"
      {...restProps}
      className={cn(dropdownMenuSubTriggerVariants(), className)}
    />
  )
}
const DropdownMenuSubContent = (props: any) => {
  const { className, ...restProps } = props
  return (
    <div
      data-slot="dropdown-menu-sub-content"
      {...restProps}
      className={cn(dropdownMenuSubContentVariants(), className)}
    />
  )
}

const DropdownMenuRadioGroup = ({ value, onValueChange, ...props }: any) => {
  return (
    <DropdownMenuRadioGroupProvider value={{ value, onValueChange }}>
      <div data-slot="dropdown-menu-radio-group" {...props} />
    </DropdownMenuRadioGroupProvider>
  )
}

const DropdownMenuRadioItem = React.forwardRef<HTMLDivElement, any>(
  ({ className, children, value, ...props }, ref) => {
    const api = useDropdownMenuContext()
    const group = useDropdownMenuRadioGroupContext()
    const checked = group?.value === value
    const optionProps = api.getOptionItemProps({
      type: 'radio',
      checked,
      value,
      disabled: props.disabled,
      onCheckedChange: (next: boolean) => {
        if (next) group?.onValueChange?.(value)
        props.onCheckedChange?.(next)
      },
    })

    return (
      <div
        {...mergeProps(optionProps, props)}
        ref={ref}
        data-slot="dropdown-menu-radio-item"
        className={cn(dropdownMenuRadioItemVariants(), className)}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {checked && (
            <svg aria-hidden="true" viewBox="0 0 8 8" fill="currentColor" className="h-2 w-2">
              <circle cx="4" cy="4" r="3" />
            </svg>
          )}
        </span>
        {children}
      </div>
    )
  }
)
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem'
const DropdownMenuShortcut = (props: any) => {
  const { className, ...restProps } = props
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      {...restProps}
      className={cn(dropdownMenuShortcutVariants(), className)}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}

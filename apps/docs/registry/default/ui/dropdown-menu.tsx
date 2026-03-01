'use client'

import * as React from 'react'
import { cn, menuConnect, menuMachine } from '@timui/core'
import { mergeProps, normalizeProps, Portal, useMachine } from '@zag-js/react'

import { Slot } from './slot'

// Context to share the machine API
const DropdownMenuContext = React.createContext<any>(null)
const DropdownMenuRadioGroupContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
} | null>(null)

const DropdownMenu = (props: any) => {
  const { children, ...menuProps } = props
  const service = useMachine(menuMachine, { id: React.useId(), ...menuProps })
  const api = menuConnect(service as any, normalizeProps)

  return <DropdownMenuContext.Provider value={api}>{children}</DropdownMenuContext.Provider>
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, any>((props, ref) => {
  const api = React.useContext(DropdownMenuContext)
  const { asChild, className, ...otherProps } = props
  const Comp = asChild ? Slot : 'button'
  const triggerProps = api?.getTriggerProps?.() ?? {}
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
    const api = React.useContext(DropdownMenuContext)
    const placement = align === 'center' ? side : `${side}-${align}`

    React.useEffect(() => {
      if (!api?.reposition) return
      api.reposition({ placement, gutter: sideOffset })
    }, [api, placement, sideOffset])

    if (!api?.open) return null

    const positionerProps = api.getPositionerProps()
    const contentProps = api.getContentProps()

    return (
      <Portal>
        <div {...positionerProps} style={{ ...positionerProps.style, zIndex: 50 }}>
          <div
            {...contentProps}
            ref={ref}
            data-slot="dropdown-menu-content"
            className={cn(
              'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
              className
            )}
            {...props}
          />
        </div>
      </Portal>
    )
  }
)
DropdownMenuContent.displayName = 'DropdownMenuContent'

const DropdownMenuItem = React.forwardRef<HTMLDivElement, any>(
  ({ className, inset, value, disabled, closeOnSelect, ...props }, ref) => {
    const api = React.useContext(DropdownMenuContext)
    const itemValue = value ?? React.useId()
    const itemProps = api.getItemProps({ value: itemValue, disabled, closeOnSelect })
    const mergedProps = mergeProps(itemProps, props)

    return (
      <div
        {...mergedProps}
        ref={ref}
        data-slot="dropdown-menu-item"
        className={cn(
          'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          inset && 'pl-8',
          className
        )}
      />
    )
  }
)
DropdownMenuItem.displayName = 'DropdownMenuItem'

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, any>(
  ({ className, ...props }, ref) => {
    const api = React.useContext(DropdownMenuContext)
    const separatorProps = api?.getSeparatorProps?.() ?? {}
    return (
      <div
        {...mergeProps(separatorProps, props)}
        ref={ref}
        data-slot="dropdown-menu-separator"
        className={cn('-mx-1 my-1 h-px bg-muted', className)}
      />
    )
  }
)
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, any>(
  ({ className, inset, ...props }, ref) => {
    // Zag has `getGroupLabelProps` but we can just use a div for simple labels
    return (
      <div
        ref={ref}
        data-slot="dropdown-menu-label"
        className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
        {...props}
      />
    )
  }
)
DropdownMenuLabel.displayName = 'DropdownMenuLabel'

// Checkbox and Radio items require specific machine logic (optionItemProps).
// Implementing simplified version mapping to itemProps but managing state manually or via machine options?
// Zag Menu has `optionItemProps`.

const DropdownMenuCheckboxItem = React.forwardRef<HTMLDivElement, any>(
  ({ className, children, checked, ...props }, ref) => {
    const api = React.useContext(DropdownMenuContext)
    const value = props.value ?? React.useId()
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
        className={cn(
          'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          className
        )}
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

// Group, Portal, Sub - Simplified/Stubbed for now as Zag Submenus are complex in single file
const DropdownMenuGroup = (props: any) => <div data-slot="dropdown-menu-group" {...props} />
const DropdownMenuPortal = (props: any) => <>{props.children}</>
const DropdownMenuSub = (props: any) => <div data-slot="dropdown-menu-sub" {...props} />
const DropdownMenuSubTrigger = (props: any) => (
  <div data-slot="dropdown-menu-sub-trigger" {...props} />
)
const DropdownMenuSubContent = (props: any) => (
  <div data-slot="dropdown-menu-sub-content" {...props} />
)

const DropdownMenuRadioGroup = ({ value, onValueChange, ...props }: any) => {
  return (
    <DropdownMenuRadioGroupContext.Provider value={{ value, onValueChange }}>
      <div data-slot="dropdown-menu-radio-group" {...props} />
    </DropdownMenuRadioGroupContext.Provider>
  )
}

const DropdownMenuRadioItem = React.forwardRef<HTMLDivElement, any>(
  ({ className, children, value, ...props }, ref) => {
    const api = React.useContext(DropdownMenuContext)
    const group = React.useContext(DropdownMenuRadioGroupContext)
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
        className={cn(
          'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          className
        )}
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
const DropdownMenuShortcut = (props: any) => <span data-slot="dropdown-menu-shortcut" {...props} />

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

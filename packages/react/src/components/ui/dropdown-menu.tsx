'use client'

import * as React from 'react'
import { Portal } from '@zag-js/react'
import type { PositioningOptions } from '@zag-js/popper'
import {
  useDropdownMenu,
  type DropdownMenuProps
} from './dropdown-menu/use-dropdown-menu'
import {
  useDropdownMenuContext,
  useDropdownMenuRadioGroupContext,
  DropdownMenuProvider,
  DropdownMenuRadioGroupProvider,
  DropdownMenuContext,
  DropdownMenuRadioGroupContext
} from './dropdown-menu/use-dropdown-menu-context'
import { mergeProps } from '@zag-js/react'
import {
  cn,
  dropdownMenuCheckboxItemVariants,
  dropdownMenuContentVariants,
  dropdownMenuItemVariants,
  dropdownMenuLabelVariants,
  dropdownMenuRadioItemVariants,
  dropdownMenuSeparatorVariants,
  dropdownMenuShortcutVariants,
  dropdownMenuSubContentVariants,
  dropdownMenuSubTriggerVariants,
} from '@timui/core'
import { Slot } from './slot'

const DropdownMenu = (props: DropdownMenuProps) => {
  const { children } = props
  const api = useDropdownMenu(props)

  return (
    <DropdownMenuProvider value={api}>
      {children}
    </DropdownMenuProvider>
  )
}

type BaseDivProps = React.ComponentPropsWithoutRef<'div'>
type BaseButtonProps = React.ComponentPropsWithoutRef<'button'>

type DropdownMenuTriggerProps = BaseButtonProps & {
  asChild?: boolean
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>((props, ref) => {
  const api = useDropdownMenuContext()
  const { asChild, className, ...otherProps } = props
  const Comp = asChild ? Slot : 'button'
  const triggerProps = api?.getTriggerProps?.() ?? {}
  const mergedProps = mergeProps(triggerProps, otherProps)

  return (
    <Comp
      ref={ref}
      data-slot="dropdown-menu-trigger"
      className={cn(className)}
      {...mergedProps}
    >
      {props.children}
    </Comp>
  )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

type DropdownMenuContentProps = BaseDivProps & {
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, side = 'bottom', align = 'center', sideOffset = 4, ...props }, ref) => {
    const api = useDropdownMenuContext()
    const placement = (
      align === 'center' ? side : `${side}-${align}`
    ) as NonNullable<PositioningOptions['placement']>
    const reposition = api?.reposition

    React.useEffect(() => {
      if (!reposition) return
      reposition({ placement, gutter: sideOffset })
    }, [placement, reposition, sideOffset])

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
              dropdownMenuContentVariants(),
              className
            )}
            {...props}
          />
        </div>
      </Portal>
    )
  }
)
DropdownMenuContent.displayName = "DropdownMenuContent"

type DropdownMenuItemProps = BaseDivProps & {
  inset?: boolean
  value?: string
  disabled?: boolean
  closeOnSelect?: boolean
}

const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
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
        className={cn(
          dropdownMenuItemVariants(),
          inset && "pl-8",
          className
        )}
      />
    )
  }
)
DropdownMenuItem.displayName = "DropdownMenuItem"

type DropdownMenuSeparatorProps = BaseDivProps

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(({ className, ...props }, ref) => {
  const api = useDropdownMenuContext()
  const separatorProps = api?.getSeparatorProps?.() ?? {}
  return (
    <div
      {...mergeProps(separatorProps, props)}
      ref={ref}
      data-slot="dropdown-menu-separator"
      className={cn(dropdownMenuSeparatorVariants(), className)}
    />
  )
})
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

type DropdownMenuLabelProps = BaseDivProps & {
  inset?: boolean
}

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(({ className, inset, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="dropdown-menu-label"
      className={cn(dropdownMenuLabelVariants(), inset && "pl-8", className)}
      {...props}
    />
  )
})
DropdownMenuLabel.displayName = "DropdownMenuLabel"

type DropdownMenuCheckboxItemProps = BaseDivProps & {
  checked?: boolean
  value?: string
  disabled?: boolean
  onCheckedChange?: (next: boolean) => void
}

const DropdownMenuCheckboxItem = React.forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(({ className, children, checked, ...props }, ref) => {
  const api = useDropdownMenuContext()
  const generatedId = React.useId()
  const { value: providedValue, disabled, onCheckedChange, ...domProps } = props
  const value = providedValue ?? generatedId
  const optionProps = api.getOptionItemProps({
    type: 'checkbox',
    checked: !!checked,
    value,
    disabled,
    onCheckedChange: (next: boolean) => onCheckedChange?.(next),
  })

  return (
    <div
      {...mergeProps(optionProps, domProps)}
      ref={ref}
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        dropdownMenuCheckboxItemVariants(),
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
})
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"

type DropdownMenuGroupProps = BaseDivProps
type DropdownMenuSubProps = BaseDivProps
type DropdownMenuPortalProps = {
  children: React.ReactNode
}
type DropdownMenuSubTriggerProps = BaseDivProps
type DropdownMenuSubContentProps = BaseDivProps

const DropdownMenuGroup = (props: DropdownMenuGroupProps) => <div data-slot="dropdown-menu-group" {...props} />
const DropdownMenuPortal = (props: DropdownMenuPortalProps) => <>{props.children}</>
const DropdownMenuSub = (props: DropdownMenuSubProps) => <div data-slot="dropdown-menu-sub" {...props} />
const DropdownMenuSubTrigger = (props: DropdownMenuSubTriggerProps) => {
  const { className, ...restProps } = props
  return (
    <div
      data-slot="dropdown-menu-sub-trigger"
      {...restProps}
      className={cn(dropdownMenuSubTriggerVariants(), className)}
    />
  )
}
const DropdownMenuSubContent = (props: DropdownMenuSubContentProps) => {
  const { className, ...restProps } = props
  return (
    <div
      data-slot="dropdown-menu-sub-content"
      {...restProps}
      className={cn(dropdownMenuSubContentVariants(), className)}
    />
  )
}

type DropdownMenuRadioGroupProps = BaseDivProps & {
  value?: string
  onValueChange?: (value: string) => void
}

const DropdownMenuRadioGroup = ({ value, onValueChange, ...props }: DropdownMenuRadioGroupProps) => {
  const groupContextValue = React.useMemo(
    () => ({ value, onValueChange }),
    [onValueChange, value]
  )
  return (
    <DropdownMenuRadioGroupProvider value={groupContextValue}>
      <div data-slot="dropdown-menu-radio-group" {...props} />
    </DropdownMenuRadioGroupProvider>
  )
}

type DropdownMenuRadioItemProps = BaseDivProps & {
  value: string
  disabled?: boolean
  onCheckedChange?: (next: boolean) => void
}

const DropdownMenuRadioItem = React.forwardRef<HTMLDivElement, DropdownMenuRadioItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const api = useDropdownMenuContext()
    const group = useDropdownMenuRadioGroupContext()
    const checked = group?.value === value
    const { disabled, onCheckedChange, ...domProps } = props
    const optionProps = api.getOptionItemProps({
      type: 'radio',
      checked,
      value,
      disabled,
      onCheckedChange: (next: boolean) => {
        if (next) group?.onValueChange?.(value)
        onCheckedChange?.(next)
      },
    })

    return (
      <div
        {...mergeProps(optionProps, domProps)}
        ref={ref}
        data-slot="dropdown-menu-radio-item"
        className={cn(
          dropdownMenuRadioItemVariants(),
          className
        )}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {checked && (
            <svg
              aria-hidden="true"
              viewBox="0 0 8 8"
              fill="currentColor"
              className="h-2 w-2"
            >
              <circle cx="4" cy="4" r="3" />
            </svg>
          )}
        </span>
        {children}
      </div>
    )
  }
)
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem"

type DropdownMenuShortcutProps = React.ComponentPropsWithoutRef<'span'>

const DropdownMenuShortcut = (props: DropdownMenuShortcutProps) => {
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

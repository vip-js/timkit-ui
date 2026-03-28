'use client'

import * as React from 'react'
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
import type { PositioningOptions } from '@zag-js/popper'
import { mergeProps, Portal } from '@zag-js/react'

import { useDropdownMenu, type DropdownMenuProps } from './dropdown-menu/use-dropdown-menu'
import {
  DropdownMenuProvider,
  DropdownMenuRadioGroupProvider,
  useDropdownMenuContext,
  useDropdownMenuRadioGroupContext,
} from './dropdown-menu/use-dropdown-menu-context'
import { Slot } from './slot'

const composeEventHandlers = <E,>(
  original?: ((event: E) => void) | undefined,
  next?: ((event: E) => void) | undefined
) => {
  return (event: E) => {
    original?.(event)
    next?.(event)
  }
}

const setRef = <T,>(ref: React.Ref<T> | undefined, value: T | null) => {
  if (!ref) return
  if (typeof ref === 'function') {
    ref(value)
    return
  }
  ;(ref as React.MutableRefObject<T | null>).current = value
}

const composeRefs = <T,>(...refs: Array<React.Ref<T> | undefined>) => {
  return (value: T | null) => {
    refs.forEach((ref) => setRef(ref, value))
  }
}

type DropdownMenuSubRootContextValue = {
  openSubId: string | null
  setOpenSubId: React.Dispatch<React.SetStateAction<string | null>>
}

type DropdownMenuSubContextValue = {
  id: string
  open: boolean
  setOpen: (open: boolean) => void
  triggerElement: HTMLElement | null
  setTriggerElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>
}

const DropdownMenuSubRootContext = React.createContext<DropdownMenuSubRootContextValue | null>(null)
const DropdownMenuSubContext = React.createContext<DropdownMenuSubContextValue | null>(null)

const useDropdownMenuSubRootContext = () => React.useContext(DropdownMenuSubRootContext)

const useDropdownMenuSubContext = () => {
  const context = React.useContext(DropdownMenuSubContext)
  if (!context) {
    throw new Error('DropdownMenuSub components must be used within DropdownMenuSub.')
  }
  return context
}

const DropdownMenu = (props: DropdownMenuProps) => {
  const { children } = props
  const api = useDropdownMenu(props)
  const [openSubId, setOpenSubId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!api.open) {
      setOpenSubId(null)
    }
  }, [api.open])

  return (
    <DropdownMenuSubRootContext.Provider value={{ openSubId, setOpenSubId }}>
      <DropdownMenuProvider value={api}>{children}</DropdownMenuProvider>
    </DropdownMenuSubRootContext.Provider>
  )
}

type BaseDivProps = React.ComponentPropsWithoutRef<'div'>
type BaseButtonProps = React.ComponentPropsWithoutRef<'button'>

type DropdownMenuTriggerProps = BaseButtonProps & {
  asChild?: boolean
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  (props, ref) => {
    const api = useDropdownMenuContext()
    const { asChild, className, ...otherProps } = props
    const Comp = asChild ? Slot : 'button'
    const triggerProps = api?.getTriggerProps?.() ?? {}
    const mergedProps = mergeProps(triggerProps, otherProps)

    return (
      <Comp ref={ref} data-slot="dropdown-menu-trigger" className={cn(className)} {...mergedProps}>
        {props.children}
      </Comp>
    )
  }
)
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

type DropdownMenuContentProps = BaseDivProps & {
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, side = 'bottom', align = 'center', sideOffset = 4, ...props }, ref) => {
    const api = useDropdownMenuContext()
    const placement = (align === 'center' ? side : `${side}-${align}`) as NonNullable<
      PositioningOptions['placement']
    >
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
            className={cn(dropdownMenuContentVariants(), className)}
            {...props}
          />
        </div>
      </Portal>
    )
  }
)
DropdownMenuContent.displayName = 'DropdownMenuContent'

type DropdownMenuItemProps = Omit<BaseDivProps, 'onSelect'> & {
  inset?: boolean
  value?: string
  disabled?: boolean
  closeOnSelect?: boolean
  asChild?: boolean
  onSelect?: () => void
}

const DropdownMenuItem = React.forwardRef<HTMLElement, DropdownMenuItemProps>(
  ({ className, inset, value, disabled, closeOnSelect, asChild = false, onSelect, ...props }, ref) => {
    const api = useDropdownMenuContext()
    const Comp = asChild ? Slot : 'div'
    const generatedId = React.useId()
    const itemValue = value ?? generatedId
    const itemProps = api.getItemProps({ value: itemValue, disabled, closeOnSelect })
    const mergedProps = mergeProps(itemProps, props)
    const onClick = composeEventHandlers(
      (mergedProps as React.HTMLAttributes<HTMLElement>).onClick,
      () => onSelect?.()
    )
    const { className: mergedClassName, ...restProps } = mergedProps as React.HTMLAttributes<HTMLElement>

    return (
      <Comp
        {...restProps}
        ref={ref as React.Ref<HTMLDivElement>}
        onClick={onClick}
        data-slot="dropdown-menu-item"
        className={cn(dropdownMenuItemVariants(), inset && 'pl-8', mergedClassName, className)}
      />
    )
  }
)
DropdownMenuItem.displayName = 'DropdownMenuItem'

type DropdownMenuSeparatorProps = BaseDivProps

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  ({ className, ...props }, ref) => {
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
  }
)
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'

type DropdownMenuLabelProps = BaseDivProps & {
  inset?: boolean
}

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
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

type DropdownMenuCheckboxItemProps = BaseDivProps & {
  checked?: boolean
  value?: string
  disabled?: boolean
  onCheckedChange?: (next: boolean) => void
}

const DropdownMenuCheckboxItem = React.forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(
  ({ className, children, checked, ...props }, ref) => {
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

type DropdownMenuGroupProps = BaseDivProps
type DropdownMenuSubProps = BaseDivProps
type DropdownMenuPortalProps = {
  children: React.ReactNode
}
type DropdownMenuSubTriggerProps = BaseDivProps & { inset?: boolean }
type DropdownMenuSubContentProps = BaseDivProps

const DropdownMenuGroup = (props: DropdownMenuGroupProps) => (
  <div data-slot="dropdown-menu-group" {...props} />
)
const DropdownMenuPortal = (props: DropdownMenuPortalProps) => <Portal>{props.children}</Portal>

const DropdownMenuSub = ({ ...props }: DropdownMenuSubProps) => {
  const root = useDropdownMenuSubRootContext()
  const id = React.useId()
  const [triggerElement, setTriggerElement] = React.useState<HTMLElement | null>(null)
  const open = root?.openSubId === id
  const setOpen = React.useCallback(
    (nextOpen: boolean) => root?.setOpenSubId(nextOpen ? id : null),
    [id, root]
  )

  return (
    <DropdownMenuSubContext.Provider value={{ id, open, setOpen, triggerElement, setTriggerElement }}>
      <div data-slot="dropdown-menu-sub" data-state={open ? 'open' : 'closed'} {...props} />
    </DropdownMenuSubContext.Provider>
  )
}

const DropdownMenuSubTrigger = React.forwardRef<HTMLDivElement, DropdownMenuSubTriggerProps>(
  ({ className, inset, onClick, onPointerEnter, onKeyDown, ...props }, ref) => {
    const sub = useDropdownMenuSubContext()

    const handleClick = composeEventHandlers(onClick, () => {
      sub.setOpen(!sub.open)
    })

    const handlePointerEnter = composeEventHandlers(onPointerEnter, () => {
      sub.setOpen(true)
    })

    const handleKeyDown = composeEventHandlers(onKeyDown, (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        sub.setOpen(true)
      }
      if (event.key === 'ArrowLeft' || event.key === 'Escape') {
        sub.setOpen(false)
      }
    })

    return (
      <div
        ref={composeRefs(ref, sub.setTriggerElement)}
        role="menuitem"
        tabIndex={-1}
        aria-haspopup="menu"
        aria-expanded={sub.open}
        data-slot="dropdown-menu-sub-trigger"
        data-state={sub.open ? 'open' : 'closed'}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onKeyDown={handleKeyDown}
        {...props}
        className={cn(dropdownMenuSubTriggerVariants(), inset && 'pl-8', className)}
      />
    )
  }
)
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger'

const DropdownMenuSubContent = React.forwardRef<HTMLDivElement, DropdownMenuSubContentProps>(
  ({ className, style, onPointerEnter, onPointerLeave, onKeyDown, ...props }, ref) => {
    const sub = useDropdownMenuSubContext()
    const contentRef = React.useRef<HTMLDivElement | null>(null)
    const [position, setPosition] = React.useState<{ left: number; top: number }>({ left: 0, top: 0 })

    const updatePosition = React.useCallback(() => {
      const trigger = sub.triggerElement
      const content = contentRef.current
      if (!trigger || !content) return

      const rect = trigger.getBoundingClientRect()
      const contentRect = content.getBoundingClientRect()
      const gap = 6
      const viewportPadding = 8

      let left = rect.right + gap
      if (left + contentRect.width > window.innerWidth - viewportPadding) {
        left = rect.left - contentRect.width - gap
      }

      let top = rect.top
      if (top + contentRect.height > window.innerHeight - viewportPadding) {
        top = Math.max(viewportPadding, window.innerHeight - contentRect.height - viewportPadding)
      }

      setPosition({ left, top })
    }, [sub.triggerElement])

    React.useLayoutEffect(() => {
      if (!sub.open) return
      updatePosition()

      const scheduleUpdate = () => {
        requestAnimationFrame(updatePosition)
      }

      window.addEventListener('resize', scheduleUpdate)
      window.addEventListener('scroll', scheduleUpdate, true)

      return () => {
        window.removeEventListener('resize', scheduleUpdate)
        window.removeEventListener('scroll', scheduleUpdate, true)
      }
    }, [sub.open, updatePosition])

    if (!sub.open) return null

    const handlePointerEnter = composeEventHandlers(onPointerEnter, () => {
      sub.setOpen(true)
    })

    const handlePointerLeave = composeEventHandlers(onPointerLeave, () => {
      sub.setOpen(false)
    })

    const handleKeyDown = composeEventHandlers(onKeyDown, (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape' || event.key === 'ArrowLeft') {
        sub.setOpen(false)
      }
    })

    return (
      <Portal>
        <div
          ref={composeRefs(ref, contentRef)}
          data-slot="dropdown-menu-sub-content"
          data-state="open"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onKeyDown={handleKeyDown}
          style={{ position: 'fixed', top: position.top, left: position.left, zIndex: 60, ...style }}
          {...props}
          className={cn(dropdownMenuSubContentVariants(), className)}
        />
      </Portal>
    )
  }
)
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent'

type DropdownMenuRadioGroupProps = BaseDivProps & {
  value?: string
  onValueChange?: (value: string) => void
}

const DropdownMenuRadioGroup = ({
  value,
  onValueChange,
  ...props
}: DropdownMenuRadioGroupProps) => {
  const groupContextValue = React.useMemo(() => ({ value, onValueChange }), [onValueChange, value])
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

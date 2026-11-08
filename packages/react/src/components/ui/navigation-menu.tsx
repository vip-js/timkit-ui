'use client'

import * as React from 'react'
import type { AssertNoExtraKeys, NavigationMenuProps as CoreNavigationMenuProps } from '@timui/core'
import {
  cn,
  navigationMenuContentVariants,
  navigationMenuIndicatorIconVariants,
  navigationMenuIndicatorVariants,
  navigationMenuItemVariants,
  navigationMenuLinkVariants,
  navigationMenuListVariants,
  navigationMenuTriggerIconVariants,
  navigationMenuTriggerStyle,
  navigationMenuVariants,
  navigationMenuViewportVariants,
  navigationMenuViewportWrapperVariants,
} from '@timui/core'
import { ChevronDown } from 'lucide-react'

import { Slot } from './slot'

type NavigationMenuProps = CoreNavigationMenuProps &
  Omit<React.HTMLAttributes<HTMLElement>, keyof CoreNavigationMenuProps> & {
    viewport?: boolean
  }
type _NavigationMenuPropsGuard = AssertNoExtraKeys<
  NavigationMenuProps,
  CoreNavigationMenuProps & React.HTMLAttributes<HTMLElement> & { viewport?: boolean }
>

type NavigationMenuRootContextValue = {
  openItem: string | null
  setOpenItem: React.Dispatch<React.SetStateAction<string | null>>
  activeItem: string | null
  setActiveItem: React.Dispatch<React.SetStateAction<string | null>>
  userSelected: boolean
  setUserSelected: React.Dispatch<React.SetStateAction<boolean>>
  viewport: boolean
  disabled: boolean
}

type NavigationMenuItemContextValue = {
  value: string
  triggerId: string
  contentId: string
  open: boolean
  setOpen: (open: boolean) => void
}

const NavigationMenuRootContext = React.createContext<NavigationMenuRootContextValue | null>(null)
const NavigationMenuItemContext = React.createContext<NavigationMenuItemContextValue | null>(null)

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

const composeEventHandlers = <E,>(
  theirHandler: ((event: E) => void) | undefined,
  ourHandler: (event: E) => void
) => {
  return (event: E) => {
    theirHandler?.(event)
    ourHandler(event)
  }
}

const useNavigationMenuRootContext = () => React.useContext(NavigationMenuRootContext)

const useNavigationMenuItemContext = () => {
  const context = React.useContext(NavigationMenuItemContext)
  if (!context) {
    throw new Error('NavigationMenu subcomponents must be used within NavigationMenuItem.')
  }
  return context
}

function navigationValues(children: React.ReactNode): string[] {
  return React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement(child)) return []
    const props = child.props as { value?: string | number | boolean | null; children?: React.ReactNode }
    const own = typeof props.value === 'string' && props.value ? [props.value] : []
    return [...own, ...navigationValues(props.children)]
  })
}

const NavigationMenu = React.forwardRef<HTMLElement, NavigationMenuProps>(
  ({ className, children, orientation = 'horizontal', viewport = true, value, disabled = false, onValueChange, ...props }, ref) => {
    const { 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, ...restProps } = props
    const [openState, setOpenState] = React.useState<string | null>(null)
    const controlled = value !== undefined
    const openItem = controlled ? value || null : openState
    const setOpenItem = React.useCallback(
      (next: React.SetStateAction<string | null>) => {
        if (disabled) return
        const resolved = typeof next === 'function' ? next(openItem) : next
        if (!controlled) setOpenState(resolved)
        onValueChange?.(resolved)
      },
      [controlled, disabled, onValueChange, openItem]
    )
    const itemValues = navigationValues(children)
    const itemIndex = openItem ? itemValues.indexOf(openItem) : -1
    const itemStatus = itemIndex < 0 ? '' : `Item ${itemIndex + 1} of ${itemValues.length}`
    const [activeItem, setActiveItem] = React.useState<string | null>(null)
    const [userSelected, setUserSelected] = React.useState(false)
    const localRef = React.useRef<HTMLElement | null>(null)

    React.useEffect(() => {
      const onPointerDown = (event: PointerEvent) => {
        const target = event.target
        if (!(target instanceof Node)) return
        if (!localRef.current?.contains(target)) {
          setOpenItem(null)
        }
      }

      document.addEventListener('pointerdown', onPointerDown)
      return () => document.removeEventListener('pointerdown', onPointerDown)
    }, [])

    return (
      <NavigationMenuRootContext.Provider
        value={{
          openItem,
          setOpenItem,
          activeItem,
          setActiveItem,
          userSelected,
          setUserSelected,
          viewport,
          disabled,
        }}
      >
        <nav
          ref={composeRefs(ref, localRef)}
          data-slot="navigation-menu"
          data-orientation={orientation}
          aria-disabled={disabled || undefined}
          data-disabled={disabled ? '' : undefined}
          className={cn(navigationMenuVariants(), className)}
          {...restProps}
          aria-labelledby={ariaLabelledBy}
          aria-label={
            ariaLabelledBy ? undefined : typeof ariaLabel === 'string' && ariaLabel ? ariaLabel : 'Navigation'
          }
        >
          {itemStatus ? <p role="status">{itemStatus}</p> : null}
          {children}
        </nav>
      </NavigationMenuRootContext.Provider>
    )
  }
)
NavigationMenu.displayName = 'NavigationMenu'

type NavigationMenuListProps = React.ComponentPropsWithoutRef<'ul'>
type NavigationMenuItemProps = React.ComponentPropsWithoutRef<'li'> & { value?: string }
type NavigationMenuTriggerProps = React.ComponentPropsWithoutRef<'button'> & {
  asChild?: boolean
}
type NavigationMenuContentProps = React.ComponentPropsWithoutRef<'div'>
type NavigationMenuLinkProps = React.ComponentPropsWithoutRef<'a'> & {
  asChild?: boolean
  active?: boolean
}
type NavigationMenuViewportProps = React.ComponentPropsWithoutRef<'div'>
type NavigationMenuIndicatorProps = React.ComponentPropsWithoutRef<'div'>

const NavigationMenuList = React.forwardRef<HTMLUListElement, NavigationMenuListProps>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-slot="navigation-menu-list"
      className={cn(navigationMenuListVariants(), className)}
      {...props}
    />
  )
)
NavigationMenuList.displayName = 'NavigationMenuList'

const NavigationMenuItem = React.forwardRef<HTMLLIElement, NavigationMenuItemProps>(
  ({ className, value: valueProp, onBlur, onMouseLeave, ...props }, ref) => {
    const root = useNavigationMenuRootContext()
    const generated = React.useId()
    const value = valueProp ?? generated
    const triggerId = React.useId()
    const contentId = React.useId()
    const open = root?.openItem === value

    const setOpen = React.useCallback(
      (nextOpen: boolean) => root?.setOpenItem(nextOpen ? value : null),
      [root, value]
    )

    const handleBlur = composeEventHandlers(onBlur, (event: React.FocusEvent<HTMLLIElement>) => {
      const relatedTarget = event.relatedTarget as Node | null
      if (!relatedTarget || !event.currentTarget.contains(relatedTarget)) {
        setOpen(false)
      }
    })

    const handleMouseLeave = composeEventHandlers(onMouseLeave, () => {
      setOpen(false)
    })

    return (
      <NavigationMenuItemContext.Provider value={{ value, triggerId, contentId, open, setOpen }}>
        <li
          ref={ref}
          data-slot="navigation-menu-item"
          data-state={open ? 'open' : 'closed'}
          className={cn(navigationMenuItemVariants(), className)}
          onBlur={handleBlur}
          onMouseLeave={handleMouseLeave}
          {...props}
        />
      </NavigationMenuItemContext.Provider>
    )
  }
)
NavigationMenuItem.displayName = 'NavigationMenuItem'

const NavigationMenuTrigger = React.forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>(
  (
    { className, children, asChild = false, disabled = false, onClick, onKeyDown, onPointerEnter, ...props },
    ref
  ) => {
    const item = useNavigationMenuItemContext()
    const root = useNavigationMenuRootContext()
    const locked = disabled || root?.disabled === true
    const Comp = asChild ? Slot : 'button'
    const handleClick = composeEventHandlers(onClick, () => {
      if (locked) return
      item.setOpen(!item.open)
    })
    const handlePointerEnter = composeEventHandlers(onPointerEnter, () => {
      if (locked) return
      item.setOpen(true)
    })
    const handleKeyDown = composeEventHandlers(onKeyDown, (event: React.KeyboardEvent) => {
      if (locked) return
      if (event.key === 'Escape') {
        item.setOpen(false)
        return
      }

      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault()
        item.setOpen(true)
      }
    })

    return (
      <Comp
        ref={ref}
        id={item.triggerId}
        aria-controls={item.contentId}
        aria-expanded={item.open}
        data-slot="navigation-menu-trigger"
        data-state={item.open ? 'open' : 'closed'}
        className={cn(navigationMenuTriggerStyle(), 'group', className)}
        disabled={locked}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
        <ChevronDown className={navigationMenuTriggerIconVariants()} aria-hidden="true" />
      </Comp>
    )
  }
)
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger'

const NavigationMenuContent = React.forwardRef<HTMLDivElement, NavigationMenuContentProps>(
  ({ className, onKeyDown, ...props }, ref) => {
    const item = useNavigationMenuItemContext()
    if (!item.open) return null

    return (
      <div
        ref={ref}
        id={item.contentId}
        aria-labelledby={item.triggerId}
        data-slot="navigation-menu-content"
        data-state="open"
        className={cn(
          navigationMenuContentVariants(),
          'absolute left-0 top-full mt-1 md:left-0 md:top-full',
          className
        )}
        {...props}
        role="region"
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (event.key !== 'Escape') return
          event.preventDefault()
          item.setOpen(false)
          const trigger = event.currentTarget.ownerDocument.getElementById(item.triggerId)
          if (trigger instanceof HTMLElement) trigger.focus()
        }}
      />
    )
  }
)
NavigationMenuContent.displayName = 'NavigationMenuContent'

const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  ({ className, asChild = false, active, onClick, ...props }, ref) => {
    const root = useNavigationMenuRootContext()
    const Comp = asChild ? Slot : 'a'
    const linkId = React.useId()
    const isActive = root?.userSelected ? root.activeItem === linkId : !!active

    const handleClick = composeEventHandlers(onClick, () => {
      root?.setOpenItem(null)
      root?.setActiveItem(linkId)
      root?.setUserSelected(true)
    })

    React.useEffect(() => {
      if (!root) return
      if (root.userSelected) return
      if (!active) return
      if (root.activeItem) return
      root.setActiveItem(linkId)
    }, [active, linkId, root])

    return (
      <Comp
        ref={ref}
        data-slot="navigation-menu-link"
        data-active={isActive ? '' : undefined}
        aria-current={isActive ? 'page' : props['aria-current']}
        className={cn(navigationMenuLinkVariants(), className)}
        onClick={handleClick}
        {...props}
      />
    )
  }
)
NavigationMenuLink.displayName = 'NavigationMenuLink'

const NavigationMenuViewport = React.forwardRef<HTMLDivElement, NavigationMenuViewportProps>(
  ({ className, ...props }, ref) => {
    const root = useNavigationMenuRootContext()
    if (root && !root.viewport) return null

    return (
      <div className={navigationMenuViewportWrapperVariants()}>
        <div
          ref={ref}
          data-slot="navigation-menu-viewport"
          data-state={root?.openItem ? 'open' : 'closed'}
          className={cn(navigationMenuViewportVariants(), className)}
          {...props}
        />
      </div>
    )
  }
)
NavigationMenuViewport.displayName = 'NavigationMenuViewport'

const NavigationMenuIndicator = React.forwardRef<HTMLDivElement, NavigationMenuIndicatorProps>(
  ({ className, ...props }, ref) => {
    const root = useNavigationMenuRootContext()
    if (!root?.openItem) return null

    return (
      <div
        ref={ref}
        data-slot="navigation-menu-indicator"
        data-state="visible"
        className={cn(navigationMenuIndicatorVariants(), className)}
        {...props}
      >
        <div className={navigationMenuIndicatorIconVariants()} />
      </div>
    )
  }
)
NavigationMenuIndicator.displayName = 'NavigationMenuIndicator'

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}

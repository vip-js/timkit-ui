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

// Simple Navigation Menu Implementation to replace Radix
// Supports basic hover triggers and interactions.

type NavigationMenuProps = CoreNavigationMenuProps &
  Omit<React.HTMLAttributes<HTMLElement>, keyof CoreNavigationMenuProps>
type _NavigationMenuPropsGuard = AssertNoExtraKeys<
  NavigationMenuProps,
  CoreNavigationMenuProps & React.HTMLAttributes<HTMLElement>
>

const NavigationMenu = React.forwardRef<HTMLElement, NavigationMenuProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        data-slot="navigation-menu"
        className={cn(navigationMenuVariants(), className)}
        {...props}
      >
        {children}
        <div className={navigationMenuViewportWrapperVariants()}>{/* Viewport placeholder */}</div>
      </nav>
    )
  }
)
NavigationMenu.displayName = 'NavigationMenu'

type NavigationMenuListProps = React.ComponentPropsWithoutRef<'ul'>
type NavigationMenuItemProps = React.ComponentPropsWithoutRef<'li'>
type NavigationMenuTriggerProps = React.ComponentPropsWithoutRef<'button'> & {
  asChild?: boolean
}
type NavigationMenuContentProps = React.ComponentPropsWithoutRef<'div'>
type NavigationMenuLinkProps = React.ComponentPropsWithoutRef<'a'> & {
  asChild?: boolean
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
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      data-slot="navigation-menu-item"
      className={cn(navigationMenuItemVariants(), className)}
      {...props}
    />
  )
)
NavigationMenuItem.displayName = 'NavigationMenuItem'

const NavigationMenuTrigger = React.forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>(
  ({ className, children, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        data-slot="navigation-menu-trigger"
        className={cn(navigationMenuTriggerStyle(), className)}
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
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="navigation-menu-content"
        className={cn(navigationMenuContentVariants(), className)}
        {...props}
      />
    )
  }
)
NavigationMenuContent.displayName = 'NavigationMenuContent'

const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  ({ className, asChild, ...props }, ref) => {
    return (
      <a
        ref={ref}
        data-slot="navigation-menu-link"
        className={cn(navigationMenuLinkVariants(), className)}
        {...props}
      />
    )
  }
)
NavigationMenuLink.displayName = 'NavigationMenuLink'

const NavigationMenuViewport = React.forwardRef<HTMLDivElement, NavigationMenuViewportProps>(
  ({ className, ...props }, ref) => (
    <div className={navigationMenuViewportWrapperVariants()}>
      <div
        ref={ref}
        data-slot="navigation-menu-viewport"
        className={cn(navigationMenuViewportVariants(), className)}
        {...props}
      />
    </div>
  )
)
NavigationMenuViewport.displayName = 'NavigationMenuViewport'

const NavigationMenuIndicator = React.forwardRef<HTMLDivElement, NavigationMenuIndicatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="navigation-menu-indicator"
      className={cn(navigationMenuIndicatorVariants(), className)}
      {...props}
    >
      <div className={navigationMenuIndicatorIconVariants()} />
    </div>
  )
)
NavigationMenuIndicator.displayName = 'NavigationMenuIndicator'

// Export standard navigation menu components

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

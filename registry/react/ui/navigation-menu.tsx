'use client'

import * as React from 'react'
import { cva } from '../lib/cva'
import { cn } from '../lib/utils'
import { Slot } from './slot'

const navigationMenuRootVariants = cva('relative z-10 flex max-w-max flex-1 items-center justify-center')
const navigationMenuVariants = navigationMenuRootVariants
const navigationMenuListVariants = cva('group flex flex-1 list-none items-center justify-center space-x-1')
const navigationMenuItemVariants = cva('relative')
const navigationMenuTriggerVariants = cva(
    'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
)
const navigationMenuTriggerStyle = navigationMenuTriggerVariants
const navigationMenuTriggerIconVariants = cva('ml-1 h-3 w-3 transition-transform duration-200 group-hover:rotate-180')
const navigationMenuContentVariants = cva(
    'left-0 top-0 w-full md:absolute md:w-auto mt-1 rounded-md border bg-popover text-popover-foreground shadow-lg hidden group-hover:block animate-in fade-in zoom-in-95'
)
const navigationMenuLinkVariants = cva(
    'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
)
const navigationMenuViewportWrapperVariants = cva('absolute left-0 top-full flex justify-center')
const navigationMenuViewportVariants = cva(
    'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]'
)
const navigationMenuIndicatorVariants = cva(
    'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in'
)
const navigationMenuIndicatorIconVariants = cva(
    'relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md'
)

// Simple Navigation Menu Implementation to replace Radix
// Supports basic hover triggers and interactions.

const NavigationMenu = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
    ({ className, children, ...props }, ref) => {
        return (
            <nav
                ref={ref}
                data-slot="navigation-menu"
                className={cn(navigationMenuVariants(), className)}
                {...props}
            >
                {children}
                <div className={navigationMenuViewportWrapperVariants()}>
                    {/* Viewport placeholder */}
                </div>
            </nav>
        )
    }
)
NavigationMenu.displayName = "NavigationMenu"

const NavigationMenuList = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        data-slot="navigation-menu-list"
        className={cn(navigationMenuListVariants(), className)}
        {...props}
    />
))
NavigationMenuList.displayName = "NavigationMenuList"

const NavigationMenuItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(({ className, ...props }, ref) => (
    <li
        ref={ref}
        data-slot="navigation-menu-item"
        className={cn(navigationMenuItemVariants(), className)}
        {...props}
    />
))
NavigationMenuItem.displayName = "NavigationMenuItem"

const NavigationMenuTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>(({ className, children, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
        <Comp
            ref={ref}
            data-slot="navigation-menu-trigger"
            className={cn(navigationMenuTriggerStyle(), className)}
            {...props}
        >
            {children}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={navigationMenuTriggerIconVariants()}
                aria-hidden="true"
            >
                <path d="m6 9 6 6 6-6" />
            </svg>
        </Comp>
    )
})
NavigationMenuTrigger.displayName = "NavigationMenuTrigger"

const NavigationMenuContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            data-slot="navigation-menu-content"
            className={cn(
                navigationMenuContentVariants(),
                className
            )}
            {...props}
        />
    )
})
NavigationMenuContent.displayName = "NavigationMenuContent"

const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { asChild?: boolean }>(({ className, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "a"
    return (
        <Comp
            ref={ref}
            data-slot="navigation-menu-link"
            className={cn(navigationMenuLinkVariants(), className)}
            {...props}
        />
    )
})
NavigationMenuLink.displayName = "NavigationMenuLink"

const NavigationMenuViewport = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div className={navigationMenuViewportWrapperVariants()}>
        <div
            ref={ref}
            data-slot="navigation-menu-viewport"
            className={cn(
                navigationMenuViewportVariants(),
                className
            )}
            {...props}
        />
    </div>
))
NavigationMenuViewport.displayName = "NavigationMenuViewport"

const NavigationMenuIndicator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        data-slot="navigation-menu-indicator"
        className={cn(
            navigationMenuIndicatorVariants(),
            className
        )}
        {...props}
    >
        <div className={navigationMenuIndicatorIconVariants()} />
    </div>
))
NavigationMenuIndicator.displayName = "NavigationMenuIndicator"

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

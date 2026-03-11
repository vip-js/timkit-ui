'use client'

import * as React from 'react'
import type { AssertNoExtraKeys, NavbarProps as CoreNavbarProps } from '@timui/core'
import {
  cn,
  navbarActionsVariants,
  navbarBrandVariants,
  navbarContentVariants,
  navbarItemVariants,
  navbarNavVariants,
  navbarVariants,
} from '@timui/core'

type NavbarProps = CoreNavbarProps & React.HTMLAttributes<HTMLElement>
type _NavbarPropsGuard = AssertNoExtraKeys<
  NavbarProps,
  CoreNavbarProps & React.HTMLAttributes<HTMLElement>
>

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(({ className, ...props }, ref) => (
  <header ref={ref} data-slot="navbar" className={cn(navbarVariants(), className)} {...props} />
))
Navbar.displayName = 'Navbar'

type NavbarContentProps = React.HTMLAttributes<HTMLDivElement>
const NavbarContent = React.forwardRef<HTMLDivElement, NavbarContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="navbar-content"
      className={cn(navbarContentVariants(), className)}
      {...props}
    />
  )
)
NavbarContent.displayName = 'NavbarContent'

type NavbarBrandProps = React.HTMLAttributes<HTMLDivElement>
const NavbarBrand = React.forwardRef<HTMLDivElement, NavbarBrandProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="navbar-brand"
      className={cn(navbarBrandVariants(), className)}
      {...props}
    />
  )
)
NavbarBrand.displayName = 'NavbarBrand'

type NavbarNavProps = React.HTMLAttributes<HTMLElement>
const NavbarNav = React.forwardRef<HTMLElement, NavbarNavProps>(({ className, ...props }, ref) => (
  <nav ref={ref} data-slot="navbar-nav" className={cn(navbarNavVariants(), className)} {...props} />
))
NavbarNav.displayName = 'NavbarNav'

type NavbarItemProps = React.HTMLAttributes<HTMLDivElement>
const NavbarItem = React.forwardRef<HTMLDivElement, NavbarItemProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="navbar-item"
      className={cn(navbarItemVariants(), className)}
      {...props}
    />
  )
)
NavbarItem.displayName = 'NavbarItem'

type NavbarActionsProps = React.HTMLAttributes<HTMLDivElement>
const NavbarActions = React.forwardRef<HTMLDivElement, NavbarActionsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="navbar-actions"
      className={cn(navbarActionsVariants(), className)}
      {...props}
    />
  )
)
NavbarActions.displayName = 'NavbarActions'

export { Navbar, NavbarActions, NavbarBrand, NavbarContent, NavbarItem, NavbarNav }

'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

const Navbar = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <header ref={ref} data-slot="navbar" className={cn('w-full', className)} {...props} />
  )
)
Navbar.displayName = 'Navbar'

const NavbarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="navbar-content"
      className={cn('flex h-16 items-center justify-between gap-4', className)}
      {...props}
    />
  )
)
NavbarContent.displayName = 'NavbarContent'

const NavbarBrand = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="navbar-brand"
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  )
)
NavbarBrand.displayName = 'NavbarBrand'

const NavbarNav = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      data-slot="navbar-nav"
      className={cn('flex items-center gap-4', className)}
      {...props}
    />
  )
)
NavbarNav.displayName = 'NavbarNav'

const NavbarItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="navbar-item"
      className={cn('flex items-center', className)}
      {...props}
    />
  )
)
NavbarItem.displayName = 'NavbarItem'

const NavbarActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="navbar-actions"
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  )
)
NavbarActions.displayName = 'NavbarActions'

export { Navbar, NavbarActions, NavbarBrand, NavbarContent, NavbarItem, NavbarNav }

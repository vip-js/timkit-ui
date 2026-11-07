'use client'

import * as React from 'react'
import {
  breadcrumbEllipsisVariants,
  breadcrumbItemVariants,
  breadcrumbLinkVariants,
  breadcrumbListVariants,
  breadcrumbPageVariants,
  breadcrumbSeparatorVariants,
  cn,
} from '@timui/core'

import { Slot } from './slot'

const BreadcrumbSeparatorContext = React.createContext<string | undefined>(undefined)
const BreadcrumbDisabledContext = React.createContext(false)
const BreadcrumbRegisterContext = React.createContext<((current: boolean) => () => void) | null>(null)

function Breadcrumb({
  separator,
  disabled = false,
  children,
  ...props
}: React.ComponentProps<'nav'> & { separator?: string; disabled?: boolean }) {
  const nextId = React.useRef(0)
  const [crumbs, setCrumbs] = React.useState<Array<{ id: number; current: boolean }>>([])
  const register = React.useCallback((current: boolean) => {
    const id = ++nextId.current
    setCrumbs((prev) => [...prev, { id, current }])
    return () => setCrumbs((prev) => prev.filter((item) => item.id !== id))
  }, [])
  const current = crumbs.findIndex((item) => item.current)
  const crumbStatus = current < 0 ? '' : `Crumb ${current + 1} of ${crumbs.length}`
  return (
    <BreadcrumbDisabledContext.Provider value={disabled}>
      <BreadcrumbSeparatorContext.Provider value={separator}>
        <BreadcrumbRegisterContext.Provider value={register}>
          <nav
            aria-label="breadcrumb"
            data-slot="breadcrumb"
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? '' : undefined}
            {...props}
          >
            {crumbStatus ? <p role="status">{crumbStatus}</p> : null}
            {children}
          </nav>
        </BreadcrumbRegisterContext.Provider>
      </BreadcrumbSeparatorContext.Provider>
    </BreadcrumbDisabledContext.Provider>
  )
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(breadcrumbListVariants(), className)}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn(breadcrumbItemVariants(), className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  asChild,
  className,
  disabled,
  href,
  onClick,
  ...props
}: React.ComponentProps<'a'> & {
  asChild?: boolean
  disabled?: boolean
}) {
  const groupDisabled = React.useContext(BreadcrumbDisabledContext)
  const register = React.useContext(BreadcrumbRegisterContext)
  const locked = disabled || groupDisabled
  React.useEffect(() => register?.(false), [register])
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(breadcrumbLinkVariants(), className)}
      {...props}
      href={locked ? undefined : href}
      aria-disabled={locked || undefined}
      tabIndex={locked ? -1 : props.tabIndex}
      onClick={(event) => {
        if (locked) {
          event.preventDefault()
          return
        }
        onClick?.(event)
      }}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  const register = React.useContext(BreadcrumbRegisterContext)
  React.useEffect(() => register?.(true), [register])
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(breadcrumbPageVariants(), className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<'li'>) {
  const separator = React.useContext(BreadcrumbSeparatorContext)
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn(breadcrumbSeparatorVariants(), className)}
      {...props}
    >
      {children ?? separator ?? '/'}
    </li>
  )
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(breadcrumbEllipsisVariants(), className)}
      {...props}
    >
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="5" cy="12" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="19" cy="12" r="1.5" />
      </svg>
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
}

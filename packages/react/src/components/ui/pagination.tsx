'use client'

import * as React from 'react'
import {
  cn,
  pageCount,
  paginationConnect,
  paginationEllipsisVariants,
  paginationListVariants,
  paginationMachine,
  paginationNextVariants,
  paginationPreviousVariants,
  paginationRootVariants,
} from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react'

import { Button, buttonVariants } from './button'

type PaginationChange = { page: number; pageSize: number }
type PaginationApi = ReturnType<typeof paginationConnect>

const PaginationContext = React.createContext<PaginationApi | null>(null)
const PaginationDisabledContext = React.createContext(false)

function Pagination({
  className,
  count,
  page,
  defaultPage = 1,
  pageSize = 10,
  siblingCount,
  disabled = false,
  onPageChange,
  children,
  ...props
}: React.ComponentProps<'nav'> & {
  count?: number
  page?: number | null
  defaultPage?: number
  pageSize?: number
  siblingCount?: number
  disabled?: boolean
  onPageChange?: (details: PaginationChange) => void
}) {
  const generatedId = React.useId()
  const service = useMachine(paginationMachine, {
    id: generatedId,
    count: count ?? 0,
    pageSize,
    ...(typeof siblingCount === 'number' ? { siblingCount } : {}),
    ...(page === undefined ? { defaultPage } : { page: page == null ? 1 : page }),
    onPageChange(details: PaginationChange) {
      if (disabled) return
      onPageChange?.(details)
    },
  })
  const api = count == null ? null : paginationConnect(service, normalizeProps)
  const shown = page === undefined ? api?.page : page == null ? undefined : page
  const pages = count == null ? 0 : pageCount(count, pageSize)

  return (
    <PaginationDisabledContext.Provider value={disabled}>
      <PaginationContext.Provider value={api}>
        <nav
          role="navigation"
          aria-label="pagination"
          aria-disabled={disabled || undefined}
          data-slot="pagination"
          className={cn(paginationRootVariants(), className)}
          {...props}
          data-page={shown}
        >
          {pages > 0 && typeof shown === 'number' ? <p role="status">{`Page ${shown} of ${pages}`}</p> : null}
          {children}
        </nav>
      </PaginationContext.Provider>
    </PaginationDisabledContext.Provider>
  )
}

function PaginationContent({ className, children, ...props }: React.ComponentProps<'ul'>) {
  const api = React.useContext(PaginationContext)
  const groupDisabled = React.useContext(PaginationDisabledContext)
  const generated =
    React.Children.count(children) === 0 && api
      ? api.pages.map((item, index) => {
          if (item.type !== 'page') {
            return (
              <li key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </li>
            )
          }
          const current = item.value === api.page
          return (
            <li key={item.value}>
              <button
                type="button"
                data-slot="pagination-link"
                aria-current={current ? 'page' : undefined}
                disabled={groupDisabled || undefined}
                onClick={() => {
                  if (groupDisabled) return
                  api.setPage(item.value)
                }}
              >
                {item.value}
              </button>
            </li>
          )
        })
      : children
  return (
    <ul
      data-slot="pagination-content"
      className={cn(paginationListVariants(), className)}
      {...props}
    >
      {generated}
    </ul>
  )
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
  isDisabled?: boolean
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<'a'>

function PaginationLink({
  className,
  isActive,
  isDisabled,
  size = 'icon',
  href,
  onClick,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={isDisabled || undefined}
      data-slot="pagination-link"
      data-active={isActive}
      data-disabled={isDisabled ? '' : undefined}
      href={isDisabled ? undefined : href}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size,
        }),
        className
      )}
      onClick={(event) => {
        if (isDisabled) {
          event.preventDefault()
          return
        }
        onClick?.(event)
      }}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const api = React.useContext(PaginationContext)
  const groupDisabled = React.useContext(PaginationDisabledContext)
  if (api) {
    const trigger = api.getPrevTriggerProps()
    return (
      <button
        data-slot="pagination-link"
        className={cn(paginationPreviousVariants(), className)}
        {...props}
        {...trigger}
        disabled={groupDisabled || trigger.disabled || undefined}
        aria-disabled={groupDisabled || trigger.disabled || undefined}
        onClick={(event) => {
          if (groupDisabled || trigger.disabled) {
            event.preventDefault()
            return
          }
          trigger.onClick?.(event)
        }}
      >
        {children ?? (
          <>
            <ChevronLeftIcon aria-hidden="true" size={16} />
            <span>Previous</span>
          </>
        )}
      </button>
    )
  }
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn(paginationPreviousVariants(), className)}
      {...props}
    >
      {children ?? (
        <>
          <ChevronLeftIcon aria-hidden="true" size={16} />
          <span>Previous</span>
        </>
      )}
    </PaginationLink>
  )
}

function PaginationNext({ className, children, ...props }: React.ComponentProps<typeof PaginationLink>) {
  const api = React.useContext(PaginationContext)
  const groupDisabled = React.useContext(PaginationDisabledContext)
  if (api) {
    const trigger = api.getNextTriggerProps()
    return (
      <button
        data-slot="pagination-link"
        className={cn(paginationNextVariants(), className)}
        {...props}
        {...trigger}
        disabled={groupDisabled || trigger.disabled || undefined}
        aria-disabled={groupDisabled || trigger.disabled || undefined}
        onClick={(event) => {
          if (groupDisabled || trigger.disabled) {
            event.preventDefault()
            return
          }
          trigger.onClick?.(event)
        }}
      >
        {children ?? (
          <>
            <span>Next</span>
            <ChevronRightIcon aria-hidden="true" size={16} />
          </>
        )}
      </button>
    )
  }
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn(paginationNextVariants(), className)}
      {...props}
    >
      {children ?? (
        <>
          <span>Next</span>
          <ChevronRightIcon aria-hidden="true" size={16} />
        </>
      )}
    </PaginationLink>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(paginationEllipsisVariants(), className)}
      {...props}
    >
      <MoreHorizontalIcon size={16} aria-hidden="true" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}

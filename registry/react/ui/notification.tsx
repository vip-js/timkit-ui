'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

const Notification = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="notification"
      className={cn(
        'bg-background border-border relative flex w-full flex-col gap-1 rounded-lg border p-4 shadow-lg',
        className
      )}
      {...props}
    />
  )
)
Notification.displayName = 'Notification'

const NotificationTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="notification-title"
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
))
NotificationTitle.displayName = 'NotificationTitle'

const NotificationDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="notification-description"
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
))
NotificationDescription.displayName = 'NotificationDescription'

const NotificationActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="notification-actions"
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  )
)
NotificationActions.displayName = 'NotificationActions'

const NotificationIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="notification-icon" className={cn('shrink-0', className)} {...props} />
  )
)
NotificationIcon.displayName = 'NotificationIcon'

export {
  Notification,
  NotificationActions,
  NotificationDescription,
  NotificationIcon,
  NotificationTitle,
}

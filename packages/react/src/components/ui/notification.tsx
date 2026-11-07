'use client'

import * as React from 'react'
import type { AssertNoExtraKeys, NotificationProps as CoreNotificationProps } from '@timui/core'
import {
  cn,
  notificationActionsVariants,
  notificationDescriptionVariants,
  notificationIconVariants,
  notificationTitleVariants,
  notificationVariants,
} from '@timui/core'

type NotificationProps = CoreNotificationProps & React.HTMLAttributes<HTMLDivElement>
type _NotificationPropsGuard = AssertNoExtraKeys<
  NotificationProps,
  CoreNotificationProps & React.HTMLAttributes<HTMLDivElement>
>

const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  (
    {
      className,
      variant = 'default',
      duration = 5000,
      closable = true,
      open: openProp,
      defaultOpen,
      onOpenChange,
      onClose,
      children,
      ...props
    },
    ref
  ) => {
    const controlled = openProp != null
    const [uncontrolled, setUncontrolled] = React.useState(defaultOpen !== false)
    const open = controlled ? openProp === true : uncontrolled
    const close = React.useCallback(() => {
      if (!open) return
      if (!controlled) setUncontrolled(false)
      onOpenChange?.(false)
      onClose?.()
    }, [controlled, onClose, onOpenChange, open])

    React.useEffect(() => {
      if (!open || !duration || duration <= 0) return
      const timer = window.setTimeout(close, duration)
      return () => window.clearTimeout(timer)
    }, [open, duration, close])

    if (!open) return null

    return (
      <div
        ref={ref}
        data-slot="notification"
        data-state="open"
        data-variant={variant}
        role="status"
        className={cn(notificationVariants(), className)}
        {...props}
      >
        {children}
        {closable ? (
          <button type="button" data-slot="notification-close" aria-label="Close" onClick={close}>
            ×
          </button>
        ) : null}
      </div>
    )
  }
)
Notification.displayName = 'Notification'

const NotificationTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="notification-title"
    className={cn(notificationTitleVariants(), className)}
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
    className={cn(notificationDescriptionVariants(), className)}
    {...props}
  />
))
NotificationDescription.displayName = 'NotificationDescription'

const NotificationActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="notification-actions"
      className={cn(notificationActionsVariants(), className)}
      {...props}
    />
  )
)
NotificationActions.displayName = 'NotificationActions'

const NotificationIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="notification-icon"
      className={cn(notificationIconVariants(), className)}
      {...props}
      aria-hidden="true"
    />
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

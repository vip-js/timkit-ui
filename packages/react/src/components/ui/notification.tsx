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
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="notification"
      className={cn(notificationVariants(), className)}
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

const NotificationActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="notification-actions"
    className={cn(notificationActionsVariants(), className)}
    {...props}
  />
))
NotificationActions.displayName = 'NotificationActions'

const NotificationIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="notification-icon"
      className={cn(notificationIconVariants(), className)}
      {...props}
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

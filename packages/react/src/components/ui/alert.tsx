'use client'

import * as React from 'react'
import type { AssertNoExtraKeys, AlertProps as CoreAlertProps } from '@timui/core'
import { alertDescriptionVariants, alertTitleVariants, alertVariants, cn } from '@timui/core'

type AlertProps = CoreAlertProps & React.HTMLAttributes<HTMLDivElement>
type _AlertPropsGuard = AssertNoExtraKeys<
  AlertProps,
  CoreAlertProps & React.HTMLAttributes<HTMLDivElement>
>

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      role="alert"
      data-slot="alert"
      data-variant={variant || 'default'}
      className={cn(alertVariants({ variant }), className)}
    >
      {variant === 'destructive' ? <p role="status">Destructive</p> : null}
      {children}
    </div>
  )
)
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      data-slot="alert-title"
      className={cn(alertTitleVariants(), className)}
      {...props}
    />
  )
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-description"
    className={cn(alertDescriptionVariants(), className)}
    {...props}
  />
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }

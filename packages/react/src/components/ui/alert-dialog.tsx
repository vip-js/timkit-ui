'use client'

import * as React from 'react'
import {
  alertDialogCancelVariants,
  AssertNoExtraKeys,
  buttonVariants,
  cn,
  AlertDialogProps as CoreAlertDialogProps,
  createTimEvent,
  dialogContentVariants,
  dialogDescriptionVariants,
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogOverlayVariants,
  dialogTitleVariants,
} from '@timui/core'
import { createPortal } from 'react-dom'

import { useAlertDialog, type UseAlertDialogProps } from './alert-dialog/use-alert-dialog'
import { AlertDialogProvider, useAlertDialogContext } from './alert-dialog/use-alert-dialog-context'
import { Slot } from './slot'

export interface AlertDialogProps extends UseAlertDialogProps {
  children?: React.ReactNode
}

const AlertDialog: React.FC<AlertDialogProps> = (props) => {
  const { children, ...restProps } = props
  const api = useAlertDialog(restProps)

  return <AlertDialogProvider value={api}>{children}</AlertDialogProvider>
}
AlertDialog.displayName = 'AlertDialog'

const AlertDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ asChild = false, ...props }, ref) => {
  const api = useAlertDialogContext()
  const Comp = asChild ? Slot : 'button'
  return <Comp data-slot="alert-dialog-trigger" {...api.getTriggerProps()} {...props} ref={ref} />
})
AlertDialogTrigger.displayName = 'AlertDialogTrigger'

const AlertDialogPortal = ({ children }: { children: React.ReactNode }) => {
  const api = useAlertDialogContext()

  if (!api.open) return null
  if (typeof window === 'undefined') return null

  return createPortal(<div data-slot="alert-dialog-portal">{children}</div>, document.body)
}
AlertDialogPortal.displayName = 'AlertDialogPortal'

const AlertDialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    const api = useAlertDialogContext()
    return (
      <div
        data-slot="alert-dialog-overlay"
        {...api.getBackdropProps()}
        {...props}
        className={cn(dialogOverlayVariants(), props.className)}
        ref={ref}
      />
    )
  }
)
AlertDialogOverlay.displayName = 'AlertDialogOverlay'

const AlertDialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    const api = useAlertDialogContext()
    return (
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <div {...api.getPositionerProps()}>
          <div
            data-slot="alert-dialog-content"
            {...api.getContentProps()}
            {...props}
            className={cn(dialogContentVariants(), props.className)}
            ref={ref}
          >
            {props.children}
          </div>
        </div>
      </AlertDialogPortal>
    )
  }
)
AlertDialogContent.displayName = 'AlertDialogContent'

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(dialogHeaderVariants(), className)} {...props} />
)
AlertDialogHeader.displayName = 'AlertDialogHeader'

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(dialogFooterVariants(), className)} {...props} />
)
AlertDialogFooter.displayName = 'AlertDialogFooter'

const AlertDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const api = useAlertDialogContext()
  return (
    <h2
      ref={ref}
      data-slot="alert-dialog-title"
      {...api.getTitleProps()}
      {...props}
      className={cn(dialogTitleVariants(), className)}
    />
  )
})
AlertDialogTitle.displayName = 'AlertDialogTitle'

const AlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const api = useAlertDialogContext()
  return (
    <p
      ref={ref}
      data-slot="alert-dialog-description"
      {...api.getDescriptionProps()}
      {...props}
      className={cn(dialogDescriptionVariants(), className)}
    />
  )
})
AlertDialogDescription.displayName = 'AlertDialogDescription'

const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const api = useAlertDialogContext()
  const { onClick, ...restProps } = props

  return (
    <button
      data-slot="alert-dialog-close"
      {...api.getCloseTriggerProps()}
      {...restProps}
      onClick={(e) => {
        api.setOpen(false)
        onClick?.(e)
      }}
      className={cn(buttonVariants(), className)}
      ref={ref}
    />
  )
})
AlertDialogAction.displayName = 'AlertDialogAction'

const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const api = useAlertDialogContext()
  const { onClick, ...restProps } = props

  return (
    <button
      data-slot="alert-dialog-close"
      {...api.getCloseTriggerProps()}
      {...restProps}
      onClick={(e) => {
        api.setOpen(false)
        onClick?.(e)
      }}
      className={cn(buttonVariants({ variant: 'outline' }), alertDialogCancelVariants(), className)}
      ref={ref}
    />
  )
})
AlertDialogCancel.displayName = 'AlertDialogCancel'

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}

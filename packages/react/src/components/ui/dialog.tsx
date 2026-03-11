'use client'

import * as React from 'react'
import type { AssertNoExtraKeys, DialogProps as CoreDialogProps } from '@timui/core'
import {
  cn,
  createTimEvent,
  dialogCloseIconVariants,
  dialogCloseVariants,
  dialogContentVariants,
  dialogDescriptionVariants,
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogOverlayVariants,
  dialogTitleVariants,
} from '@timui/core'
import { createPortal } from 'react-dom'

import { useDialog, type UseDialogProps } from './dialog/use-dialog'
import { DialogProvider, useDialogContext } from './dialog/use-dialog-context'
import { Slot } from './slot'

export interface DialogProps extends UseDialogProps {
  children?: React.ReactNode
}

const Dialog: React.FC<DialogProps> = (props) => {
  const { children, ...restProps } = props
  const api = useDialog(restProps)

  return <DialogProvider value={api}>{children}</DialogProvider>
}
Dialog.displayName = 'Dialog'

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ asChild = false, ...props }, ref) => {
  const api = useDialogContext()
  const Comp = asChild ? Slot : 'button'
  return <Comp data-slot="dialog-trigger" {...api.getTriggerProps()} {...props} ref={ref} />
})
DialogTrigger.displayName = 'DialogTrigger'

const DialogPortal = ({ children }: { children: React.ReactNode }) => {
  const api = useDialogContext()

  // Only render when open for simplicity
  if (!api.open) return null
  if (typeof window === 'undefined') return null

  return createPortal(<div data-slot="dialog-portal">{children}</div>, document.body)
}
DialogPortal.displayName = 'DialogPortal'

const DialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    const api = useDialogContext()
    return (
      <div
        data-slot="dialog-overlay"
        {...api.getBackdropProps()}
        {...props}
        className={cn(dialogOverlayVariants(), props.className)}
        ref={ref}
      />
    )
  }
)
DialogOverlay.displayName = 'DialogOverlay'

const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    const api = useDialogContext()

    return (
      <DialogPortal>
        <DialogOverlay />
        <div {...api.getPositionerProps()}>
          <div
            data-slot="dialog-content"
            {...api.getContentProps()}
            {...props}
            className={cn(dialogContentVariants(), props.className)}
            ref={ref}
          >
            {props.children}
            <button
              data-slot="dialog-close"
              className={cn(dialogCloseVariants())}
              {...api.getCloseTriggerProps()}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={dialogCloseIconVariants()}
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
      </DialogPortal>
    )
  }
)
DialogContent.displayName = 'DialogContent'

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(dialogHeaderVariants(), className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(dialogFooterVariants(), className)} {...props} />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    const api = useDialogContext()
    return (
      <h2
        ref={ref}
        data-slot="dialog-title"
        {...api.getTitleProps()}
        {...props}
        className={cn(dialogTitleVariants(), className)}
      />
    )
  }
)
DialogTitle.displayName = 'DialogTitle'

type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
  asChild?: boolean
}

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, asChild, children, ...props }, ref) => {
    const api = useDialogContext()
    if (asChild) {
      return (
        <Slot
          data-slot="dialog-description"
          {...api.getDescriptionProps()}
          {...props}
          className={cn(dialogDescriptionVariants(), className)}
        >
          {children}
        </Slot>
      )
    }

    return (
      <p
        ref={ref}
        data-slot="dialog-description"
        {...api.getDescriptionProps()}
        {...props}
        className={cn(dialogDescriptionVariants(), className)}
      >
        {children}
      </p>
    )
  }
)
DialogDescription.displayName = 'DialogDescription'

type DialogCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
}

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ className, asChild, children, ...props }, ref) => {
    const api = useDialogContext()
    const sharedProps = {
      ...api.getCloseTriggerProps(),
      className: cn(className),
      ...props,
    }

    if (asChild) {
      return (
        <Slot data-slot="dialog-close" {...sharedProps}>
          {children}
        </Slot>
      )
    }

    return (
      <button ref={ref} data-slot="dialog-close" {...sharedProps}>
        {children}
      </button>
    )
  }
)
DialogClose.displayName = 'DialogClose'

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

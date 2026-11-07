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
import { useReturnFocus } from './use-return-focus'

const DialogFocusContext = React.createContext<(node: HTMLElement | null) => void>(() => undefined)
const DialogDisabledContext = React.createContext(false)
const DialogModalContext = React.createContext(true)
const DialogHasTitleContext = React.createContext({
  hasTitle: false,
  setHasTitle: (_present: boolean) => {},
})

export interface DialogProps extends UseDialogProps {
  children?: React.ReactNode
}

const Dialog: React.FC<DialogProps> = (props) => {
  const { children, ...restProps } = props
  const api = useDialog(restProps)
  const rememberTrigger = useReturnFocus(api.open)
  const [hasTitle, setHasTitle] = React.useState(false)
  const titlePresence = React.useMemo(() => ({ hasTitle, setHasTitle }), [hasTitle])

  return (
    <DialogDisabledContext.Provider value={props.disabled === true}>
      <DialogModalContext.Provider value={props.modal !== false}>
        <DialogProvider value={api}>
          <DialogHasTitleContext.Provider value={titlePresence}>
          <DialogFocusContext.Provider value={rememberTrigger}>
            {api.open ? <p role="status">Opened</p> : null}
            {children}
          </DialogFocusContext.Provider>
          </DialogHasTitleContext.Provider>
        </DialogProvider>
      </DialogModalContext.Provider>
    </DialogDisabledContext.Provider>
  )
}
Dialog.displayName = 'Dialog'

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ asChild = false, ...props }, ref) => {
  const api = useDialogContext()
  const rememberTrigger = React.useContext(DialogFocusContext)
  const groupDisabled = React.useContext(DialogDisabledContext)
  const locked = Boolean(props.disabled) || groupDisabled
  const triggerProps = api.getTriggerProps()
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      data-slot="dialog-trigger"
      {...triggerProps}
      {...props}
      ref={ref}
      disabled={locked || undefined}
      aria-disabled={locked || undefined}
      onClick={(event) => {
        if (locked) {
          event.preventDefault()
          return
        }
        rememberTrigger(event.currentTarget)
        triggerProps.onClick?.(event)
        props.onClick?.(event)
      }}
    />
  )
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
  ({ 'aria-label': ariaLabel, ...props }, ref) => {
    const api = useDialogContext()
    const modal = React.useContext(DialogModalContext)
    const { hasTitle } = React.useContext(DialogHasTitleContext)
    const passedName = typeof ariaLabel === 'string' && ariaLabel ? ariaLabel : undefined

    return (
      <DialogPortal>
        {modal ? <DialogOverlay /> : null}
        <div {...api.getPositionerProps()}>
          <div
            data-slot="dialog-content"
            {...api.getContentProps()}
            {...props}
            aria-label={hasTitle ? undefined : passedName ?? 'Dialog'}
            className={cn(dialogContentVariants(), props.className)}
            aria-modal={modal}
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
    const { setHasTitle } = React.useContext(DialogHasTitleContext)
    React.useLayoutEffect(() => {
      setHasTitle(true)
      return () => setHasTitle(false)
    }, [setHasTitle])
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

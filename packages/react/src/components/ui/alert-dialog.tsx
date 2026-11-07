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
import { useReturnFocus } from './use-return-focus'

const AlertDialogFocusContext = React.createContext<(node: HTMLElement | null) => void>(() => undefined)
const AlertDialogHasTitleContext = React.createContext({
  hasTitle: false,
  setHasTitle: (_present: boolean) => {},
})

export interface AlertDialogProps extends UseAlertDialogProps {
  children?: React.ReactNode
}

const AlertDialog: React.FC<AlertDialogProps> = (props) => {
  const { children, ...restProps } = props
  const api = useAlertDialog(restProps)
  const rememberTrigger = useReturnFocus(api.open)
  const [hasTitle, setHasTitle] = React.useState(false)
  const titlePresence = React.useMemo(() => ({ hasTitle, setHasTitle }), [hasTitle])

  return (
    <AlertDialogProvider value={api}>
      <AlertDialogHasTitleContext.Provider value={titlePresence}>
      <AlertDialogFocusContext.Provider value={rememberTrigger}>
        {api.open ? <p role="status">Opened</p> : null}
        {children}
      </AlertDialogFocusContext.Provider>
      </AlertDialogHasTitleContext.Provider>
    </AlertDialogProvider>
  )
}
AlertDialog.displayName = 'AlertDialog'

const AlertDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ asChild = false, disabled, onClick, ...props }, ref) => {
  const api = useAlertDialogContext()
  const rememberTrigger = React.useContext(AlertDialogFocusContext)
  const triggerProps = api.getTriggerProps()
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      data-slot="alert-dialog-trigger"
      {...triggerProps}
      {...props}
      disabled={api.disabled || disabled}
      ref={ref}
      onClick={(event) => {
        if (api.disabled || disabled) return
        rememberTrigger(event.currentTarget)
        triggerProps.onClick?.(event)
        onClick?.(event)
      }}
    />
  )
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
  ({ 'aria-label': ariaLabel, ...props }, ref) => {
    const api = useAlertDialogContext()
    const { hasTitle } = React.useContext(AlertDialogHasTitleContext)
    const passedName = typeof ariaLabel === 'string' && ariaLabel ? ariaLabel : undefined
    return (
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <div {...api.getPositionerProps()}>
          <div
            data-slot="alert-dialog-content"
            {...api.getContentProps()}
            {...props}
            aria-label={hasTitle ? undefined : passedName ?? 'Alert dialog'}
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
  const { setHasTitle } = React.useContext(AlertDialogHasTitleContext)
  React.useLayoutEffect(() => {
    setHasTitle(true)
    return () => setHasTitle(false)
  }, [setHasTitle])
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
>(({ className, disabled, ...props }, ref) => {
  const api = useAlertDialogContext()
  const { onClick, ...restProps } = props
  const blocked = api.disabled || disabled

  return (
    <button
      data-slot="alert-dialog-action"
      {...api.getCloseTriggerProps()}
      {...restProps}
      disabled={blocked}
      onClick={(e) => {
        if (blocked) return
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
>(({ className, disabled, ...props }, ref) => {
  const api = useAlertDialogContext()
  const { onClick, ...restProps } = props
  const blocked = api.disabled || disabled

  return (
    <button
      data-slot="alert-dialog-cancel"
      {...api.getCloseTriggerProps()}
      {...restProps}
      disabled={blocked}
      onClick={(e) => {
        if (blocked) return
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

'use client'

import * as React from 'react'
import {
  cn,
  toastActionVariants,
  toastCloseVariants,
  toastDescriptionVariants,
  toastTitleVariants,
  toastVariants,
  toastViewportVariants,
  type ToastVariants,
} from '@timui/core'
import { XIcon } from 'lucide-react'

import { Slot } from './slot'

// Simple Context
const ToastContext = React.createContext<{
  close: () => void
} | null>(null)

type ToastProviderProps = {
  children: React.ReactNode
  swipeDirection?: 'left' | 'right' | 'up' | 'down'
}

const ToastProvider = ({ children, swipeDirection: _swipeDirection }: ToastProviderProps) => {
  void _swipeDirection
  return <>{children}</>
}

function ToastViewport({
  className,
  ...props
}: React.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      className={cn(
        toastViewportVariants(),
        className
      )}
      {...props}
    />
  )
}

const Toast = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> &
  ToastVariants & {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onPause?: () => void
    onResume?: () => void
  }
>(({ className, variant, open, onOpenChange, onPause: _onPause, onResume: _onResume, ...props }, ref) => {
  void _onPause
  void _onResume

  const handleClose = () => {
    onOpenChange?.(false)
  }

  // Animation state handling using simple data attributes
  // In a real implementation without Radix, we need 'mounting' logic or keeping it mounted until animation ends.
  // 'use-toast' handles removing from array after delay.
  // So we just render 'open' style or 'closed' style.

  if (open === false) return null // Or animate out?
  // Radix stays mounted for animation.

  return (
    <ToastContext.Provider value={{ close: handleClose }}>
      <li
        ref={ref}
        data-state={open ? 'open' : 'closed'}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      />
    </ToastContext.Provider>
  )
})
Toast.displayName = "Toast"

type ToastActionProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  altText?: string
  asChild?: boolean
}

const ToastAction = React.forwardRef<HTMLButtonElement, ToastActionProps>(
  ({ className, altText: _altText, asChild, ...props }, ref) => {
    void _altText
    const sharedProps = {
      className: cn(toastActionVariants(), className),
      ...props,
    }

    if (asChild) {
      return <Slot ref={ref as React.Ref<HTMLElement>} {...sharedProps} />
    }

    return <button ref={ref} {...sharedProps} />
  }
)
ToastAction.displayName = "ToastAction"

type ToastCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
}

const ToastClose = React.forwardRef<HTMLButtonElement, ToastCloseProps>(
  ({ className, onClick, asChild, children, ...props }, ref) => {
  const context = React.useContext(ToastContext)

  const sharedProps = {
    className: cn(toastCloseVariants(), className),
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      context?.close()
      onClick?.(e)
    },
    'toast-close': '',
    ...props,
  }

  if (asChild) {
    return <Slot ref={ref as React.Ref<HTMLElement>} {...sharedProps}>{children}</Slot>
  }

  return (
    <button ref={ref} {...sharedProps}>
      {children ?? <XIcon className="h-4 w-4" />}
    </button>
  )
})
ToastClose.displayName = "ToastClose"

const ToastTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(toastTitleVariants(), className)}
    {...props}
  />
))
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(toastDescriptionVariants(), className)}
    {...props}
  />
))
ToastDescription.displayName = "ToastDescription"

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  type ToastProps,
  type ToastActionElement
}

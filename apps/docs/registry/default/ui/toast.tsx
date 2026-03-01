'use client'

import * as React from 'react'
import { cn } from '@timui/core'
import { cva, type VariantProps } from 'class-variance-authority'
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

function ToastViewport({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      className={cn(
        'fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:bottom-0 sm:flex-col md:max-w-[420px]',
        className
      )}
      {...props}
    />
  )
}

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Toast = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> &
    VariantProps<typeof toastVariants> & {
      open?: boolean
      onOpenChange?: (open: boolean) => void
      onPause?: () => void
      onResume?: () => void
    }
>(
  (
    { className, variant, open, onOpenChange, onPause: _onPause, onResume: _onResume, ...props },
    ref
  ) => {
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
  }
)
Toast.displayName = 'Toast'

type ToastActionProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  altText?: string
  asChild?: boolean
}

const ToastAction = React.forwardRef<HTMLButtonElement, ToastActionProps>(
  ({ className, altText: _altText, asChild, ...props }, ref) => {
    void _altText
    const sharedProps = {
      className: cn(
        'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
        className
      ),
      ...props,
    }

    if (asChild) {
      return <Slot ref={ref as React.Ref<HTMLElement>} {...sharedProps} />
    }

    return <button ref={ref} {...sharedProps} />
  }
)
ToastAction.displayName = 'ToastAction'

type ToastCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
}

const ToastClose = React.forwardRef<HTMLButtonElement, ToastCloseProps>(
  ({ className, onClick, asChild, children, ...props }, ref) => {
    const context = React.useContext(ToastContext)

    const sharedProps = {
      className: cn(
        'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
        className
      ),
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        context?.close()
        onClick?.(e)
      },
      'toast-close': '',
      ...props,
    }

    if (asChild) {
      return (
        <Slot ref={ref as React.Ref<HTMLElement>} {...sharedProps}>
          {children}
        </Slot>
      )
    }

    return (
      <button ref={ref} {...sharedProps}>
        {children ?? <XIcon className="h-4 w-4" />}
      </button>
    )
  }
)
ToastClose.displayName = 'ToastClose'

const ToastTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm font-semibold', className)} {...props} />
  )
)
ToastTitle.displayName = 'ToastTitle'

const ToastDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm opacity-90', className)} {...props} />
  )
)
ToastDescription.displayName = 'ToastDescription'

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
  type ToastActionElement,
}

'use client'

import * as React from 'react'
import { cn } from '@timui/core'
import { createPortal } from 'react-dom'

import { Slot } from './slot'

const DialogContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
  modal: boolean
} | null>(null)

function useDialog() {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error('Dialog components must be used within Dialog')
  }
  return context
}

const Dialog = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    modal?: boolean
  }
>(({ children, open, defaultOpen, onOpenChange, modal = true, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(
    open !== undefined ? open : (defaultOpen ?? false)
  )

  // Sync controlled state
  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  const handleOpenChange = React.useCallback(
    (value: boolean) => {
      if (open === undefined) {
        setIsOpen(value)
      }
      onOpenChange?.(value)
    },
    [open, onOpenChange]
  )

  const contextValue = React.useMemo(
    () => ({
      open: isOpen,
      setOpen: handleOpenChange,
      modal,
    }),
    [isOpen, handleOpenChange, modal]
  )

  return <DialogContext.Provider value={contextValue}>{children}</DialogContext.Provider>
})
Dialog.displayName = 'Dialog'

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, onClick, asChild = false, ...props }, ref) => {
  const { setOpen } = useDialog()
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      ref={ref}
      data-slot="dialog-trigger"
      type="button"
      onClick={(e) => {
        setOpen(true)
        onClick?.(e)
      }}
      className={cn(className)}
      {...props}
    />
  )
})
DialogTrigger.displayName = 'DialogTrigger'

const DialogPortal = ({ children }: { children: React.ReactNode }) => {
  const { open } = useDialog()

  // Only render when open for simplicity in docs preview
  if (!open) return null
  if (typeof window === 'undefined') return null

  return createPortal(<div data-slot="dialog-portal">{children}</div>, document.body)
}
DialogPortal.displayName = 'DialogPortal'

const DialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, onClick, ...props }, ref) => {
    const { setOpen } = useDialog()
    return (
      <div
        ref={ref}
        data-slot="dialog-overlay"
        data-state="open"
        onClick={(e) => {
          setOpen(false)
          onClick?.(e)
        }}
        className={cn(
          'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          className
        )}
        {...props}
      />
    )
  }
)
DialogOverlay.displayName = 'DialogOverlay'

type DialogContentProps = React.HTMLAttributes<HTMLDivElement> & {
  onOpenAutoFocus?: (event: React.SyntheticEvent) => void
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, onOpenAutoFocus: _onOpenAutoFocus, ...props }, ref) => {
    const { setOpen } = useDialog()

    return (
      <DialogPortal>
        <DialogOverlay />
        <div
          ref={ref}
          data-slot="dialog-content"
          data-state="open"
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
            className
          )}
          {...props}
        >
          {children}
          <button
            data-slot="dialog-close"
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            <span className="sr-only">Close</span>
          </button>
        </div>
      </DialogPortal>
    )
  }
)
DialogContent.displayName = 'DialogContent'

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      data-slot="dialog-title"
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
)
DialogTitle.displayName = 'DialogTitle'

type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
  asChild?: boolean
}

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, asChild, children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          data-slot="dialog-description"
          className={cn('text-muted-foreground text-sm', className)}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <p
        ref={ref}
        data-slot="dialog-description"
        className={cn('text-muted-foreground text-sm', className)}
        {...props}
      >
        {children}
      </p>
    )
  }
)
DialogDescription.displayName = 'DialogDescription'

// Helper for close trigger
type DialogCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
}

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ className, onClick, asChild, children, ...props }, ref) => {
    const { setOpen } = useDialog()
    const sharedProps = {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(false)
        onClick?.(e)
      },
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
      <button ref={ref} data-slot="dialog-close" type="button" {...sharedProps}>
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

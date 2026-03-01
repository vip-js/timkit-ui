'use client'

import * as React from 'react'
import { buttonVariants, cn } from '@timui/core'
import { createPortal } from 'react-dom'

import { Slot } from './slot'

const AlertDialogContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

function useAlertDialog() {
  const context = React.useContext(AlertDialogContext)
  if (!context) {
    throw new Error('AlertDialog components must be used within AlertDialog')
  }
  return context
}

const AlertDialog = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(({ children, open, defaultOpen, onOpenChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(
    open !== undefined ? open : (defaultOpen ?? false)
  )

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
    }),
    [isOpen, handleOpenChange]
  )

  return <AlertDialogContext.Provider value={contextValue}>{children}</AlertDialogContext.Provider>
})
AlertDialog.displayName = 'AlertDialog'

const AlertDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, onClick, asChild = false, ...props }, ref) => {
  const { setOpen } = useAlertDialog()
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      ref={ref}
      data-slot="alert-dialog-trigger"
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
AlertDialogTrigger.displayName = 'AlertDialogTrigger'

const AlertDialogPortal = ({ children }: { children: React.ReactNode }) => {
  const { open } = useAlertDialog()

  if (!open) return null
  if (typeof window === 'undefined') return null

  return createPortal(<div data-slot="alert-dialog-portal">{children}</div>, document.body)
}
AlertDialogPortal.displayName = 'AlertDialogPortal'

const AlertDialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="alert-dialog-overlay"
        data-state="open"
        className={cn(
          'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          className
        )}
        {...props}
      />
    )
  }
)
AlertDialogOverlay.displayName = 'AlertDialogOverlay'

const AlertDialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <div
          ref={ref}
          data-slot="alert-dialog-content"
          data-state="open"
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </AlertDialogPortal>
    )
  }
)
AlertDialogContent.displayName = 'AlertDialogContent'

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
)
AlertDialogHeader.displayName = 'AlertDialogHeader'

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
)
AlertDialogFooter.displayName = 'AlertDialogFooter'

const AlertDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    data-slot="alert-dialog-title"
    className={cn('text-lg font-semibold', className)}
    {...props}
  />
))
AlertDialogTitle.displayName = 'AlertDialogTitle'

const AlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="alert-dialog-description"
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
))
AlertDialogDescription.displayName = 'AlertDialogDescription'

const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
  const { setOpen } = useAlertDialog()
  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        setOpen(false) // Action confirms and closes
        onClick?.(e)
      }}
      className={cn(buttonVariants(), className)}
      {...props}
    />
  )
})
AlertDialogAction.displayName = 'AlertDialogAction'

const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
  const { setOpen } = useAlertDialog()
  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        setOpen(false)
        onClick?.(e)
      }}
      className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)}
      {...props}
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

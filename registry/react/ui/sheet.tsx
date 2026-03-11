'use client'

import * as React from 'react'
import * as dialog from '@zag-js/dialog'
import { mergeProps, normalizeProps, Portal, useMachine } from '@zag-js/react'

import { cva, type VariantProps } from '../lib/cva'
import { Presence } from '../lib/presence'
import { cn } from '../lib/utils'

const sheetOverlayVariants = cva(
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80'
)
const sheetContentVariants = cva(
  'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 gap-4 p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 border-b',
        bottom:
          'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 border-t',
        left: 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
        right:
          'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
)
const sheetHeaderVariants = cva('flex flex-col space-y-2 text-center sm:text-left')
const sheetFooterVariants = cva('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2')
const sheetTitleVariants = cva('text-foreground text-lg font-semibold')
const sheetDescriptionVariants = cva('text-muted-foreground text-sm')
const sheetCloseVariants = cva(
  'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary'
)
const sheetCloseIconVariants = cva('h-4 w-4')
const sheetPositionerVariants = cva('fixed inset-0 z-50 flex')

// Context
const SheetContext = React.createContext<{
  api: dialog.Api
} | null>(null)

function useSheet() {
  const context = React.useContext(SheetContext)
  if (!context) {
    throw new Error('Sheet components must be used within Sheet')
  }
  return context
}

interface SheetProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
  id?: string
  side?: 'top' | 'bottom' | 'left' | 'right'
}

const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(
  ({ children, open, defaultOpen, onOpenChange, modal = true, id, ...props }, ref) => {
    const generatedId = React.useId()
    const sheetId = id ?? generatedId

    // Zag dialog machine reused for sheet
    const service: dialog.Service = useMachine(dialog.machine, {
      id: sheetId,
      open,
      defaultOpen,
      modal,
      onOpenChange(details: { open: boolean }) {
        onOpenChange?.(details.open)
      },
    })
    const api = dialog.connect(service, normalizeProps)

    return <SheetContext.Provider value={{ api }}>{children}</SheetContext.Provider>
  }
)
Sheet.displayName = 'Sheet'

const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { api } = useSheet()
  const triggerProps = api.getTriggerProps()
  const mergedProps = mergeProps(triggerProps, props)

  return <button ref={ref} className={cn(className)} {...mergedProps} />
})
SheetTrigger.displayName = 'SheetTrigger'

const SheetPortal = ({ children }: { children: React.ReactNode }) => {
  return <Portal>{children}</Portal>
}
SheetPortal.displayName = 'SheetPortal'

const SheetOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { api } = useSheet()
    const backdropProps = api.getBackdropProps()
    const mergedProps = mergeProps(backdropProps, props)

    return (
      <Presence
        present={api.open}
        lazyMount
        unmountOnExit
        ref={ref}
        data-slot="sheet-overlay"
        className={cn(sheetOverlayVariants(), className)}
        {...mergedProps}
      />
    )
  }
)
SheetOverlay.displayName = 'SheetOverlay'

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<'div'>, VariantProps<typeof sheetContentVariants> {}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = 'right', className, children, ...props }, ref) => {
    const { api } = useSheet()
    const positionerProps = api.getPositionerProps()
    const contentProps = api.getContentProps()
    const mergedProps = mergeProps(contentProps, props)
    // Overriding positioner styles to allow full-height flex for sheet
    // Actually SheetPositionerVariants handles it: 'fixed inset-0 z-50 flex'
    // But we need to make sure interaction handling is correct (modal behavior)

    return (
      <SheetPortal>
        <SheetOverlay />
        <Presence
          present={api.open}
          lazyMount
          unmountOnExit
          {...positionerProps}
          className={cn(sheetPositionerVariants())}
          style={{ zIndex: 50, ...positionerProps.style, pointerEvents: 'none' }}
        >
          {/* The content itself should be interactive */}
          <div
            ref={ref}
            data-slot="sheet-content"
            className={cn(sheetContentVariants({ side }), className)}
            style={{ pointerEvents: 'auto' }}
            {...mergedProps}
          >
            {children}
            <button {...api.getCloseTriggerProps()} className={cn(sheetCloseVariants())}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(sheetCloseIconVariants())}
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>
        </Presence>
      </SheetPortal>
    )
  }
)
SheetContent.displayName = 'SheetContent'

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(sheetHeaderVariants(), className)} {...props} />
)
SheetHeader.displayName = 'SheetHeader'

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(sheetFooterVariants(), className)} {...props} />
)
SheetFooter.displayName = 'SheetFooter'

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    const { api } = useSheet()
    const titleProps = api.getTitleProps()
    const mergedProps = mergeProps(titleProps, props)
    return (
      <h2
        ref={ref}
        data-slot="sheet-title"
        className={cn(sheetTitleVariants(), className)}
        {...mergedProps}
      />
    )
  }
)
SheetTitle.displayName = 'SheetTitle'

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { api } = useSheet()
  const descProps = api.getDescriptionProps()
  const mergedProps = mergeProps(descProps, props)
  return (
    <p
      ref={ref}
      data-slot="sheet-description"
      className={cn(sheetDescriptionVariants(), className)}
      {...mergedProps}
    />
  )
})
SheetDescription.displayName = 'SheetDescription'

const SheetClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { api } = useSheet()
  const closeProps = api.getCloseTriggerProps()
  const mergedProps = mergeProps(closeProps, props)
  return (
    <button ref={ref} data-slot="sheet-close-trigger" className={cn(className)} {...mergedProps} />
  )
})
SheetClose.displayName = 'SheetClose'

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}

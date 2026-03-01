'use client'

import * as React from 'react'
import { cn, dialogConnect, dialogMachine } from '@timui/core'
import { normalizeProps, Portal, useMachine } from '@zag-js/react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'

// Context sharing
const SheetContext = React.createContext<any>(null)

const Sheet = (props: any) => {
  const service = useMachine(dialogMachine, { id: React.useId() })
  const api = dialogConnect(service as any, normalizeProps)

  return <SheetContext.Provider value={api}>{props.children}</SheetContext.Provider>
}

const SheetTrigger = (props: any) => {
  const api = React.useContext(SheetContext)
  return React.cloneElement(props.children, api.triggerProps)
}

const SheetClose = (props: any) => {
  const api = React.useContext(SheetContext)
  return React.cloneElement(props.children, api.closeTriggerProps)
}

const SheetPortal = (props: any) => <>{props.children}</>

const sheetOverlayVariants = cva(
  'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
)

const SheetOverlay = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => {
    const api = React.useContext(SheetContext)
    if (!api.open) return null

    return (
      <div
        {...api.backdropProps}
        ref={ref}
        className={cn(sheetOverlayVariants(), className)}
        {...props}
      />
    )
  }
)
SheetOverlay.displayName = 'SheetOverlay'

const sheetContentVariants = cva(
  'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<'div'>, VariantProps<typeof sheetContentVariants> {}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = 'right', className, children, ...props }, ref) => {
    const api = React.useContext(SheetContext)
    if (!api.open) return null

    return (
      <Portal>
        <SheetOverlay />
        <div
          {...api.positionerProps} // Zag Dialog positioner usually handles centering, for Sheet we override with fixed positioning
          className="fixed inset-0 pointer-events-none flex"
          style={{ zIndex: 50 }}
        >
          {/* Wrapper to handle Sheet transitions and positioning logic manually if needed or via api.contentProps? 
               Zag Dialog assumes centered modal. Sheet requires side docking. 
               We use `contentProps` but style it with Tailwind class `fixed ...`.
           */}
          <div
            {...api.contentProps}
            ref={ref}
            className={cn(sheetContentVariants({ side }), className, 'pointer-events-auto')}
            {...props}
          >
            {children}
            <button
              {...api.closeTriggerProps}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
      </Portal>
    )
  }
)
SheetContent.displayName = 'SheetContent'

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
)
SheetHeader.displayName = 'SheetHeader'

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
)
SheetFooter.displayName = 'SheetFooter'

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    const api = React.useContext(SheetContext)
    return (
      <h2
        {...api.titleProps}
        ref={ref}
        className={cn('text-lg font-semibold text-foreground', className)}
        {...props}
      />
    )
  }
)
SheetTitle.displayName = 'SheetTitle'

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const api = React.useContext(SheetContext)
  return (
    <p
      {...api.descriptionProps}
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
})
SheetDescription.displayName = 'SheetDescription'

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetPortal,
  SheetOverlay,
}

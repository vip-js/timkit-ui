'use client'

import * as React from 'react'
import type { AssertNoExtraKeys, SheetProps as CoreSheetProps } from '@timui/core'
import {
  cn,
  sheetCloseIconVariants,
  sheetCloseVariants,
  sheetContentVariants,
  sheetDescriptionVariants,
  sheetFooterVariants,
  sheetHeaderVariants,
  sheetOverlayVariants,
  sheetPositionerVariants,
  sheetTitleVariants,
} from '@timui/core'
import { Portal } from '@zag-js/react'
import type { VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'

import { useSheet } from './sheet/use-sheet'
import { SheetProvider, useSheetContext } from './sheet/use-sheet-context'

// Context is imported from ./sheet/use-sheet-context

type SheetProps = CoreSheetProps & { children?: React.ReactNode }
type _SheetPropsGuard = AssertNoExtraKeys<
  SheetProps,
  CoreSheetProps & { children?: React.ReactNode }
>

const Sheet = (props: SheetProps) => {
  const { children, ...machineProps } = props
  const api = useSheet(machineProps)

  return <SheetProvider value={api}>{children}</SheetProvider>
}

const SheetTrigger = ({ children }: { children: React.ReactElement }) => {
  const api = useSheetContext()
  return React.cloneElement(children, api.getTriggerProps())
}

const SheetClose = ({ children }: { children: React.ReactElement }) => {
  const api = useSheetContext()
  return React.cloneElement(children, api.getCloseTriggerProps())
}

const SheetPortal = ({ children }: { children?: React.ReactNode }) => <>{children}</>

const SheetOverlay = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => {
    const api = useSheetContext()

    return (
      <div
        {...api.getBackdropProps()}
        ref={ref}
        className={cn(sheetOverlayVariants(), className)}
        {...props}
      />
    )
  }
)
SheetOverlay.displayName = 'SheetOverlay'

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<'div'>, VariantProps<typeof sheetContentVariants> {}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = 'right', className, children, ...props }, ref) => {
    const api = useSheetContext()
    if (!api.open) return null

    return (
      <Portal>
        <SheetOverlay />
        <div
          {...api.getPositionerProps()} // Zag Dialog positioner usually handles centering, for Sheet we override with fixed positioning
          className={cn(sheetPositionerVariants())}
          style={{ zIndex: 50 }}
        >
          {/* Wrapper to handle Sheet transitions and positioning logic manually if needed or via api.contentProps? 
               Zag Dialog assumes centered modal. Sheet requires side docking. 
               We use `contentProps` but style it with Tailwind class `fixed ...`.
           */}
          <div
            {...api.getContentProps()}
            ref={ref}
            className={cn(sheetContentVariants({ side }), className)}
            {...props}
          >
            {children}
            <button {...api.getCloseTriggerProps()} className={cn(sheetCloseVariants())}>
              <X className={sheetCloseIconVariants()} />
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
  <div className={cn(sheetHeaderVariants(), className)} {...props} />
)
SheetHeader.displayName = 'SheetHeader'

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(sheetFooterVariants(), className)} {...props} />
)
SheetFooter.displayName = 'SheetFooter'

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    const api = useSheetContext()
    return (
      <h2
        {...api?.getTitleProps?.()}
        ref={ref}
        className={cn(sheetTitleVariants(), className)}
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
  const api = useSheetContext()
  return (
    <p
      {...api?.getDescriptionProps?.()}
      ref={ref}
      className={cn(sheetDescriptionVariants(), className)}
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

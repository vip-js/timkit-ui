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
import { useReturnFocus } from './use-return-focus'

const SheetFocusContext = React.createContext<(node: HTMLElement | null) => void>(() => undefined)
const SheetDisabledContext = React.createContext(false)
const SheetSideContext = React.createContext<CoreSheetProps['side']>(undefined)
const SheetHasTitleContext = React.createContext({
  hasTitle: false,
  setHasTitle: (_present: boolean) => {},
})

// Context is imported from ./sheet/use-sheet-context

type SheetProps = CoreSheetProps & { children?: React.ReactNode }
type _SheetPropsGuard = AssertNoExtraKeys<
  SheetProps,
  CoreSheetProps & { children?: React.ReactNode }
>

const Sheet = (props: SheetProps) => {
  const { children, side, ...machineProps } = props
  const api = useSheet(machineProps)
  const rememberTrigger = useReturnFocus(api.open)
  const [hasTitle, setHasTitle] = React.useState(false)
  const titlePresence = React.useMemo(() => ({ hasTitle, setHasTitle }), [hasTitle])

  return (
    <SheetDisabledContext.Provider value={props.disabled === true}>
      <SheetProvider value={api}>
        <SheetHasTitleContext.Provider value={titlePresence}>
        <SheetSideContext.Provider value={side}>
          <SheetFocusContext.Provider value={rememberTrigger}>
            {api.open ? <p role="status">Opened</p> : null}
            {children}
          </SheetFocusContext.Provider>
        </SheetSideContext.Provider>
        </SheetHasTitleContext.Provider>
      </SheetProvider>
    </SheetDisabledContext.Provider>
  )
}

const SheetTrigger = ({
  children,
}: {
  children: React.ReactElement<Record<string, unknown>>
}) => {
  const api = useSheetContext()
  const rememberTrigger = React.useContext(SheetFocusContext)
  const groupDisabled = React.useContext(SheetDisabledContext)
  const locked = Boolean(children.props.disabled) || groupDisabled
  const triggerProps = api.getTriggerProps()
  const childClick = children.props.onClick
  return React.cloneElement(children, {
    ...triggerProps,
    disabled: locked || undefined,
    'aria-disabled': locked || undefined,
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      if (locked) {
        event.preventDefault()
        return
      }
      rememberTrigger(event.currentTarget)
      triggerProps.onClick?.(event)
      if (typeof childClick === 'function') childClick(event)
    },
  })
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
  ({ side, className, children, 'aria-label': ariaLabel, ...props }, ref) => {
    const api = useSheetContext()
    const inheritedSide = React.useContext(SheetSideContext)
    const resolvedSide = side ?? inheritedSide ?? 'right'
    const { hasTitle } = React.useContext(SheetHasTitleContext)
    const passedName = typeof ariaLabel === 'string' && ariaLabel ? ariaLabel : undefined
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
            data-slot="sheet-content"
            ref={ref}
            className={cn(sheetContentVariants({ side: resolvedSide }), className)}
            {...props}
            aria-label={hasTitle ? undefined : passedName ?? 'Sheet'}
          >
            {children}
            <button
              {...api.getCloseTriggerProps()}
              data-slot="sheet-close"
              className={cn(sheetCloseVariants())}
            >
              <X aria-hidden="true" className={sheetCloseIconVariants()} />
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
    const { setHasTitle } = React.useContext(SheetHasTitleContext)
    React.useLayoutEffect(() => {
      setHasTitle(true)
      return () => setHasTitle(false)
    }, [setHasTitle])
    return (
      <h2
        {...api?.getTitleProps?.()}
        ref={ref}
        data-slot="sheet-title"
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
      data-slot="sheet-description"
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

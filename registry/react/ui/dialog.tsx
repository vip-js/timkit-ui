'use client'

import * as React from 'react'
import { cva, type VariantProps } from '../lib/cva'
import { cn } from '../lib/utils'
import * as dialog from '@zag-js/dialog'
import { mergeProps, normalizeProps, useMachine, Portal } from '@zag-js/react'
import { createContext } from '../lib/create-context'
import { Presence } from '../lib/presence'


const dialogOverlayVariants = cva(
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80'
)
const dialogPositionerVariants = cva('fixed inset-0 z-50 flex items-center justify-center')
const dialogContentVariants = cva(
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[48%] data-[state=closed]:slide-out-to-left-[50%] data-[state=open]:slide-in-from-top-[48%] data-[state=open]:slide-in-from-left-[50%] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg'
)
const dialogCloseVariants = cva(
    'ring-offset-background focus:ring-ring absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
)
const dialogCloseIconVariants = cva('h-4 w-4')
const dialogHeaderVariants = cva('flex flex-col space-y-1.5 text-center sm:text-left')
const dialogFooterVariants = cva(
    'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'
)
const dialogTitleVariants = cva('text-lg font-semibold leading-none tracking-tight')
const dialogDescriptionVariants = cva('text-sm text-muted-foreground')

export const [DialogProvider, useDialog] = createContext<{
    api: dialog.Api
}>({
    name: 'DialogContext',
    hookName: 'useDialog',
    providerName: '<Dialog />',
})

interface DialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    modal?: boolean
    id?: string
    closeOnInteractOutside?: boolean
}

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
    ({ children, open, defaultOpen, onOpenChange, modal = true, id, closeOnInteractOutside = true, ...props }, ref) => {
        const generatedId = React.useId()
        const dialogId = id ?? generatedId

        // Zag dialog machine
        const service: dialog.Service = useMachine(dialog.machine, {
            id: dialogId,
            open,
            defaultOpen,
            modal,
            closeOnInteractOutside,
            onOpenChange(details: { open: boolean }) {
                onOpenChange?.(details.open)
            },
        })
        const api = dialog.connect(service, normalizeProps)

        return (
            <DialogProvider value={{ api }}>
                {children}
            </DialogProvider>
        )
    }
)
Dialog.displayName = 'Dialog'

const DialogTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
    const { api } = useDialog()
    const triggerProps = api.getTriggerProps()
    const mergedProps = mergeProps(triggerProps, props)

    return (
        <button
            ref={ref}
            className={cn(className)}
            {...mergedProps}
        />
    )
})
DialogTrigger.displayName = 'DialogTrigger'

const DialogPortal = ({ children }: { children: React.ReactNode }) => {
    return <Portal>{children}</Portal>
}
DialogPortal.displayName = 'DialogPortal'

const DialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        const { api } = useDialog()
        const backdropProps = api.getBackdropProps()
        const mergedProps = mergeProps(backdropProps, props)

        return (
            <Presence
                present={api.open}
                lazyMount
                unmountOnExit
                ref={ref}
                data-slot="dialog-overlay"
                className={cn(dialogOverlayVariants(), className)}
                {...mergedProps}
            />
        )
    }
)
DialogOverlay.displayName = 'DialogOverlay'

const DialogContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { api } = useDialog()
    const positionerProps = api.getPositionerProps()
    const contentProps = api.getContentProps()
    const mergedProps = mergeProps(contentProps, props)

    return (
        <DialogPortal>
            <DialogOverlay />
            <Presence
                present={api.open}
                lazyMount
                unmountOnExit
                {...positionerProps}
                className={cn(dialogPositionerVariants())}
                style={{ zIndex: 50, ...positionerProps.style }}
            >
                <div
                    ref={ref}
                    data-slot="dialog-content"
                    className={cn(dialogContentVariants(), className)}
                    {...mergedProps}
                >
                    {children}
                    <button
                        {...api.getCloseTriggerProps()}
                        className={cn(dialogCloseVariants())}
                    >
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
                            className={cn(dialogCloseIconVariants())}
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                        <span className="sr-only">Close</span>
                    </button>
                </div>
            </Presence>
        </DialogPortal>
    )
})
DialogContent.displayName = 'DialogContent'

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn(dialogHeaderVariants(), className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn(dialogFooterVariants(), className)} {...props} />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
    const { api } = useDialog()
    const titleProps = api.getTitleProps()
    const mergedProps = mergeProps(titleProps, props)
    return (
        <h2
            ref={ref}
            data-slot="dialog-title"
            className={cn(dialogTitleVariants(), className)}
            {...mergedProps}
        />
    )
})
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
    const { api } = useDialog()
    const descProps = api.getDescriptionProps()
    const mergedProps = mergeProps(descProps, props)
    return (
        <p
            ref={ref}
            data-slot="dialog-description"
            className={cn(dialogDescriptionVariants(), className)}
            {...mergedProps}
        />
    )
})
DialogDescription.displayName = 'DialogDescription'

const DialogClose = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
    const { api } = useDialog()
    const closeProps = api.getCloseTriggerProps()
    const mergedProps = mergeProps(closeProps, props)
    return (
        <button
            ref={ref}
            data-slot="dialog-close-trigger"
            className={cn(className)}
            {...mergedProps}
        />
    )
})
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

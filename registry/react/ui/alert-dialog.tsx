'use client'

import * as React from 'react'
import { cva } from '../lib/cva'
import { cn } from '../lib/utils'
import * as dialog from '@zag-js/dialog'
import { mergeProps, normalizeProps, useMachine, Portal } from '@zag-js/react'
import { buttonVariants } from './button'
import { Presence } from '../lib/presence'
// Reusing dialog base variants, but customizing for Alert Dialog if needed
// Or just inline them for zero deps if I want to be super strict.
// Assuming users who copy Alert Dialog also copy Dialog or I should duplicate base styles?
// Instruction says "self-contained". Duplicating variants avoids dependency on 'dialog.tsx' if users just want Alert Dialog.
// But they share CVA in core. Let's duplicate for safety.
const dialogOverlayVariants = cva(
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80'
)
const dialogContentVariants = cva(
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[48%] data-[state=closed]:slide-out-to-left-[50%] data-[state=open]:slide-in-from-top-[48%] data-[state=open]:slide-in-from-left-[50%] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg'
)
const dialogHeaderVariants = cva('flex flex-col space-y-2 text-center sm:text-left')
const dialogFooterVariants = cva(
    'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'
)
const dialogTitleVariants = cva('text-lg font-semibold')
const dialogDescriptionVariants = cva('text-sm text-muted-foreground')

// Alert Dialog Specific Variants
const alertDialogOverlayVariants = cva(
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80'
)
const alertDialogContentVariants = cva(
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[48%] data-[state=closed]:slide-out-to-left-[50%] data-[state=open]:slide-in-from-top-[48%] data-[state=open]:slide-in-from-left-[50%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg'
)
const alertDialogCancelVariants = cva('mt-2 sm:mt-0')

// Context
const AlertDialogContext = React.createContext<{
    api: dialog.Api
} | null>(null)

function useAlertDialog() {
    const context = React.useContext(AlertDialogContext)
    if (!context) {
        throw new Error('AlertDialog components must be used within AlertDialog')
    }
    return context
}

interface AlertDialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    id?: string
}

const AlertDialog = React.forwardRef<HTMLDivElement, AlertDialogProps>(
    ({ children, open, defaultOpen, onOpenChange, id, ...props }, ref) => {
        const generatedId = React.useId()
        const dialogId = id ?? generatedId

        // Zag dialog machine with role="alertdialog"
        const service: dialog.Service = useMachine(dialog.machine, {
            id: dialogId,
            role: 'alertdialog',
            open,
            defaultOpen,
            closeOnInteractOutside: false, // Alert Dialog typically modal and strict
            onOpenChange(details: { open: boolean }) {
                onOpenChange?.(details.open)
            },
        })
        const api = dialog.connect(service, normalizeProps)

        return (
            <AlertDialogContext.Provider value={{ api }}>
                {children}
            </AlertDialogContext.Provider>
        )
    }
)
AlertDialog.displayName = 'AlertDialog'

const AlertDialogTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
    const { api } = useAlertDialog()
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
AlertDialogTrigger.displayName = 'AlertDialogTrigger'

const AlertDialogPortal = ({ children }: { children: React.ReactNode }) => {
    return <Portal>{children}</Portal>
}
AlertDialogPortal.displayName = 'AlertDialogPortal'

const AlertDialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        const { api } = useAlertDialog()
        const backdropProps = api.getBackdropProps()
        const mergedProps = mergeProps(backdropProps, props)

        return (
            <Presence
                present={api.open}
                lazyMount
                unmountOnExit
                ref={ref}
                data-slot="alert-dialog-overlay"
                className={cn(alertDialogOverlayVariants(), className)}
                {...mergedProps}
            />
        )
    }
)
AlertDialogOverlay.displayName = 'AlertDialogOverlay'

const AlertDialogContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { api } = useAlertDialog()
    const positionerProps = api.getPositionerProps()
    const contentProps = api.getContentProps()
    const mergedProps = mergeProps(contentProps, props)

    return (
        <AlertDialogPortal>
            <AlertDialogOverlay />
            <div
                {...positionerProps}
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ zIndex: 50 }}
            >
                <div
                    ref={ref}
                    data-slot="alert-dialog-content"
                    className={cn(alertDialogContentVariants(), className)}
                    {...mergedProps}
                >
                    {children}
                </div>
            </div>
        </AlertDialogPortal>
    )
})
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
    const { api } = useAlertDialog()
    const titleProps = api.getTitleProps()
    const mergedProps = mergeProps(titleProps, props)
    return (
        <h2
            ref={ref}
            data-slot="alert-dialog-title"
            className={cn(dialogTitleVariants(), className)}
            {...mergedProps}
        />
    )
})
AlertDialogTitle.displayName = 'AlertDialogTitle'

const AlertDialogDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
    const { api } = useAlertDialog()
    const descProps = api.getDescriptionProps()
    const mergedProps = mergeProps(descProps, props)
    return (
        <p
            ref={ref}
            data-slot="alert-dialog-description"
            className={cn(dialogDescriptionVariants(), className)}
            {...mergedProps}
        />
    )
})
AlertDialogDescription.displayName = 'AlertDialogDescription'

const AlertDialogAction = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
    const { api } = useAlertDialog()
    // Action confirms. We don't have a specific 'action' prop in Zag dialog triggers usually, just a close trigger.
    // But conventionally 'Action' means confirm.
    // We can just manually close it on click, or treat it as a close trigger if that's the desired behavior.
    // Usually Action = Delete/Confirm.
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e)
        if (!e.defaultPrevented) {
            api.setOpen(false)
        }
    }

    return (
        <button
            ref={ref}
            className={cn(buttonVariants(), className)}
            onClick={handleClick}
            {...props}
        />
    )
})
AlertDialogAction.displayName = 'AlertDialogAction'

const AlertDialogCancel = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
    const { api } = useAlertDialog()
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e)
        if (!e.defaultPrevented) {
            api.setOpen(false)
        }
    }

    return (
        <button
            ref={ref}
            className={cn(
                buttonVariants({ variant: 'outline' }),
                alertDialogCancelVariants(),
                className
            )}
            onClick={handleClick}
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

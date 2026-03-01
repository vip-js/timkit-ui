'use client'

import * as React from 'react'
import { cva, type VariantProps } from '../lib/cva'
import { cn } from '../lib/utils'
import { Slot } from './slot'

const toastVariants = cva(
    'group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all',
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

const toastViewportVariants = cva(
    'fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:bottom-0 sm:flex-col md:max-w-[420px]'
)
const toastTitleVariants = cva('text-sm font-semibold [&+div]:text-xs')
const toastDescriptionVariants = cva('text-sm opacity-90')
const toastActionVariants = cva(
    'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive'
)
const toastCloseVariants = cva(
    'absolute top-1 right-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600'
)


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
    VariantProps<typeof toastVariants> & {
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

    if (open === false) return null

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
                {children ?? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                )}
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

'use client'

import * as React from 'react'
import * as ResizablePrimitive from 'react-resizable-panels'

import { cva } from '../lib/cva'
import { cn } from '../lib/utils'

const resizableRootVariants = cva(
    'flex h-full w-full data-[direction=vertical]:flex-col'
)
const resizablePanelGroupVariants = resizableRootVariants
const resizableHandleVariants = cva(
    'bg-border relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[direction=vertical]:h-px data-[direction=vertical]:w-full data-[direction=vertical]:after:inset-x-0 data-[direction=vertical]:after:top-1/2 data-[direction=vertical]:after:h-1 data-[direction=vertical]:after:-translate-y-1/2'
)
const resizableHandleIconVariants = cva(
    'bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border'
)

function ResizablePanelGroup({
    className,
    ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
    return (
        <ResizablePrimitive.PanelGroup
            data-slot="resizable-panel-group"
            className={cn(resizablePanelGroupVariants(), className)}
            {...props}
        />
    )
}

function ResizablePanel({ ...props }: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
    return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
    withHandle,
    className,
    ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
    withHandle?: boolean
}) {
    return (
        <ResizablePrimitive.PanelResizeHandle
            data-slot="resizable-handle"
            className={cn(
                resizableHandleVariants(),
                className
            )}
            {...props}
        >
            {withHandle && (
                <div className={resizableHandleIconVariants()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" /></svg>
                </div>
            )}
        </ResizablePrimitive.PanelResizeHandle>
    )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }

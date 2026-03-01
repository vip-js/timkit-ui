'use client'

import * as React from 'react'
import { type ClassValue, clsx } from '../lib/clsx'
import { twMerge } from '../lib/tailwind-merge'
import { cva, type VariantProps } from '../lib/cva'
import { Command as CommandPrimitive } from 'cmdk'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog'

// Utility for cn
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const commandVariants = cva(
    'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground'
)
const commandDialogVariants = cva('')
const commandDialogContentVariants = cva('overflow-hidden p-0 sm:max-w-lg [&>button:last-child]:hidden')
const commandInputWrapperVariants = cva('border-input flex items-center border-b px-5')
const commandInputVariants = cva(
    'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50'
)
const commandListVariants = cva('max-h-[300px] overflow-y-auto overflow-x-hidden')
const commandEmptyVariants = cva('py-6 text-center text-sm')
const commandGroupVariants = cva(
    'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground'
)
const commandSeparatorVariants = cva('bg-border -mx-1 h-px')
const commandItemVariants = cva(
    'aria-selected:bg-accent aria-selected:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
)
const commandShortcutVariants = cva('ms-auto text-xs tracking-widest opacity-60')

const Command = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
    <CommandPrimitive
        ref={ref}
        data-slot="command"
        className={cn(commandVariants(), className)}
        {...props}
    />
))
Command.displayName = CommandPrimitive.displayName

interface CommandDialogProps extends React.ComponentProps<typeof Dialog> {
    title?: string
    description?: string
}

const CommandDialog = ({
    title = 'Command Palette',
    description = 'Search for a command to run...',
    children,
    ...props
}: CommandDialogProps) => {
    return (
        <Dialog {...props}>
            <DialogHeader className="sr-only">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogContent className={cn(commandDialogContentVariants())}>
                <Command className={cn(commandDialogVariants())}>
                    {children}
                </Command>
            </DialogContent>
        </Dialog>
    )
}

const CommandInput = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Input>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
    <div className={cn(commandInputWrapperVariants())} cmdk-input-wrapper="">
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
            className="text-muted-foreground/80 me-3 h-5 w-5"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
        <CommandPrimitive.Input
            ref={ref}
            data-slot="command-input-wrapper"
            className={cn(commandInputVariants(), className)}
            {...props}
        />
    </div>
))
CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.List
        ref={ref}
        data-slot="command-list"
        className={cn(commandListVariants(), className)}
        {...props}
    />
))
CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Empty>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
    <CommandPrimitive.Empty
        ref={ref}
        data-slot="command-empty"
        className={cn(commandEmptyVariants())}
        {...props}
    />
))
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Group>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Group
        ref={ref}
        data-slot="command-group"
        className={cn(commandGroupVariants(), className)}
        {...props}
    />
))
CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Separator
        ref={ref}
        data-slot="command-separator"
        className={cn(commandSeparatorVariants(), className)}
        {...props}
    />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Item
        ref={ref}
        data-slot="command-item"
        className={cn(commandItemVariants(), className)}
        {...props}
    />
))
CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            data-slot="command-shortcut"
            className={cn(commandShortcutVariants(), className)}
            {...props}
        />
    )
}
CommandShortcut.displayName = 'CommandShortcut'

export {
    Command,
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
    CommandSeparator,
}

'use client'
'use client'

import * as React from 'react'
import {
  cn,
  commandDialogContentVariants,
  commandDialogVariants,
  commandEmptyVariants,
  commandGroupVariants,
  commandInputVariants,
  commandInputWrapperVariants,
  commandItemVariants,
  commandListVariants,
  commandSeparatorVariants,
  commandShortcutVariants,
  commandVariants,
} from '@timui/core'
import { Command as CommandPrimitive, useCommandState } from 'cmdk'
import { SearchIcon } from 'lucide-react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog'

const CommandDisabledContext = React.createContext(false)

function commandValues(children: React.ReactNode): string[] {
  return React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement(child)) return []
    const props = child.props as { value?: unknown; children?: React.ReactNode }
    const own = typeof props.value === 'string' && props.value ? [props.value] : []
    return [...own, ...commandValues(props.children)]
  })
}

function CommandSelectionStatus({ items }: { items: string[] }) {
  const value = useCommandState((state) => state.value)
  const index = items.indexOf(value)
  if (!value || index < 0) return null
  return <p role="status">{`Item ${index + 1} of ${items.length}`}</p>
}

function Command({
  className,
  disabled = false,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive> & { disabled?: boolean }) {
  return (
    <CommandDisabledContext.Provider value={disabled}>
      <CommandPrimitive
        data-slot="command"
        className={cn(commandVariants(), className)}
        aria-disabled={disabled || undefined}
        data-disabled={disabled ? '' : undefined}
        {...props}
      >
        <CommandSelectionStatus items={commandValues(children)} />
        {children}
      </CommandPrimitive>
    </CommandDisabledContext.Provider>
  )
}

function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent className={commandDialogContentVariants()}>
        <Command className={commandDialogVariants()}>{children}</Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  disabled,
  placeholder,
  'aria-label': ariaLabel,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  const groupDisabled = React.useContext(CommandDisabledContext)
  const locked = disabled || groupDisabled
  return (
    <div className={commandInputWrapperVariants()} cmdk-input-wrapper="">
      <SearchIcon size={20} className="text-muted-foreground/80 me-3" aria-hidden="true" />
      <CommandPrimitive.Input
        data-slot="command-input-wrapper"
        className={cn(commandInputVariants(), className)}
        disabled={locked}
        {...props}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder || 'Command menu'}
      />
    </div>
  )
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(commandListVariants(), className)}
      {...props}
    />
  )
}

function CommandEmpty({ className, ...props }: React.ComponentProps<'div'>) {
  const count = useCommandState((state) => state.filtered.count)
  if (count !== 0) return null
  return (
    <div
      data-slot="command-empty"
      role="status"
      className={cn(commandEmptyVariants(), className)}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(commandGroupVariants(), className)}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn(commandSeparatorVariants(), className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  disabled,
  onSelect,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  const groupDisabled = React.useContext(CommandDisabledContext)
  const locked = disabled || groupDisabled
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(commandItemVariants(), className)}
      disabled={locked}
      aria-disabled={locked || undefined}
      onSelect={(value) => {
        if (locked) return
        onSelect?.(value)
      }}
      {...props}
    />
  )
}

function CommandShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <kbd
      data-slot="command-shortcut"
      className={cn(commandShortcutVariants(), className)}
      {...props}
      aria-hidden="true"
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
}

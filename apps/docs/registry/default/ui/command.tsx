'use client'

import * as React from 'react'
import { cn, comboboxCollection, comboboxConnect, comboboxMachine } from '@timui/core'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import { SearchIcon } from 'lucide-react'

import { Dialog, DialogContent } from './dialog'

// Type definitions to simulate CMDK API with Zag Combobox
type CommandProps = React.ComponentPropsWithoutRef<'div'> & {
  label?: string
  filter?: (value: string, search: string) => number
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
  loop?: boolean
  shouldFilter?: boolean
}

const CommandContext = React.createContext<any>(null)

export const useCommand = () => {
  const context = React.useContext(CommandContext)
  if (!context) {
    throw new Error('Command components must be used within Command')
  }
  return context
}

const Command = React.forwardRef<React.ElementRef<'div'>, CommandProps>(
  (
    {
      className,
      children,
      filter,
      value,
      onValueChange,
      defaultValue,
      loop = true,
      shouldFilter = true,
      ...props
    },
    ref
  ) => {
    void loop
    // Basic filtering implementation for client-side filtering equivalent to CMDK default
    // Zag allows 'collection' to handle filtering if using collection.
    // Here we are building a generic wrapper.
    // For simplicity in this migration, using generic combobox setup.
    // Assuming standard controlled usage or uncontrolled with simple items.

    const [options, setOptions] = React.useState<any[]>([])
    const collection = comboboxCollection({
      items: options,
      itemToString: (item) => item.label,
      itemToValue: (item) => item.value,
    })

    const service = useMachine(comboboxMachine, {
      id: React.useId(),
      collection,
      value: value ? [value] : defaultValue ? [defaultValue] : undefined,
      onValueChange: (details) => onValueChange?.(details.value[0]),
      inputBehavior: 'autohighlight',
      open: true, // CMDK is always open usually, unless in dialog
    })

    const api = comboboxConnect(service, normalizeProps)

    return (
      <CommandContext.Provider value={{ api, options, setOptions }}>
        <div
          ref={ref}
          className={cn(
            'bg-popover text-popover-foreground flex size-full flex-col overflow-hidden rounded-md',
            className
          )}
          {...api.getRootProps()}
          {...props}
        >
          {children}
        </div>
      </CommandContext.Provider>
    )
  }
)
Command.displayName = 'Command'

const CommandDialog = ({ children, ...props }: React.ComponentProps<typeof Dialog>) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[data-zag-combobox-input]]:h-12">{children}</Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<'input'>,
  React.ComponentPropsWithoutRef<'input'> & { onValueChange?: (value: string) => void }
>(({ className, onValueChange, ...props }, ref) => {
  const { api } = useCommand()
  const mergedProps = mergeProps(api.getInputProps(), props)
  const {
    onChange: mergedOnChange,
    value,
    defaultValue,
    className: mergedClassName,
    ...restProps
  } = mergedProps
  const inputProps = {
    ...restProps,
    ...(value !== undefined ? { value } : {}),
    ...(value === undefined && defaultValue !== undefined ? { defaultValue } : {}),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      mergedOnChange?.(e)
      onValueChange?.(e.target.value)
    },
  }
  return (
    <div className="flex items-center border-b px-3" data-zag-combobox-control="">
      <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <input
        ref={ref}
        className={cn(
          'placeholder:text-muted-foreground flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50',
          mergedClassName,
          className
        )}
        {...inputProps}
      />
    </div>
  )
})
CommandInput.displayName = 'CommandInput'

const CommandList = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  const { api } = useCommand()
  return (
    <div
      {...api.getContentProps()} // Zag Content usually contains the list
      ref={ref}
      className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
      {...props}
    />
  )
})
CommandList.displayName = 'CommandList'

const CommandEmpty = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>((props, ref) => {
  // Empty state handling in Zag is often checking `api.empty`
  const { api } = useCommand()
  // Simplistic check: if not empty, return null? Or rely on css?
  // Zag doesn't auto-hide "Empty" component inherently, user logic usually does.
  // But standard pattern is:
  // if (!api.empty) return null
  return <div ref={ref} className="py-6 text-center text-sm" {...props} />
})
CommandEmpty.displayName = 'CommandEmpty'

const CommandGroup = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'> & { heading?: React.ReactNode }
>(({ className, heading, children, ...props }, ref) => {
  const { api } = useCommand()
  return (
    <div
      {...api.getItemGroupProps({ label: heading as string })}
      ref={ref}
      className={cn(
        'overflow-hidden p-1 text-foreground [&_[data-zag-combobox-item-group-label]]:px-2 [&_[data-zag-combobox-item-group-label]]:py-1.5 [&_[data-zag-combobox-item-group-label]]:text-xs [&_[data-zag-combobox-item-group-label]]:font-medium [&_[data-zag-combobox-item-group-label]]:text-muted-foreground',
        className
      )}
      {...props}
    >
      {heading && (
        <div
          {...api.getItemGroupLabelProps({ htmlFor: heading as string })}
          className="px-2 py-1.5 text-xs font-medium text-muted-foreground"
        >
          {heading}
        </div>
      )}
      {children}
    </div>
  )
})
CommandGroup.displayName = 'CommandGroup'

const CommandSeparator = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('bg-border -mx-1 h-px', className)} {...props} />
))
CommandSeparator.displayName = 'CommandSeparator'

const CommandItem = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'> & { value?: string; onSelect?: (value: string) => void }
>(({ className, value, onSelect, ...props }, ref) => {
  const { api } = useCommand()
  // CMDK items usually register themselves. Zag relies on `options` usually being passed to Root.
  // However, for declarative children pattern (which cmdk uses), we might need to register.
  // But basic rendering without strict collection management (fallback to DOM based) might work if we mimic Zag Item props.
  // Zag Item props require `item` object.

  // Fallback: Construct a dummy item object for Zag usage.
  const item = {
    label: props.children?.toString() || value || '',
    value: value || props.children?.toString() || '',
  }
  const itemState = api.getItemState({ item })

  return (
    <div
      {...api.getItemProps({ item })}
      ref={ref}
      className={cn(
        'relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        itemState.selected ? 'bg-accent text-accent-foreground' : '',
        className
      )}
      onClick={() => {
        onSelect?.(item.value)
        api.setValue([item.value])
      }}
      {...props}
    />
  )
})
CommandItem.displayName = 'CommandItem'

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
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

'use client'

import * as React from 'react'
import {
  cn,
  tagsInputConnect,
  tagsInputMachine,
  type TagsInputProps as CoreTagsInputProps,
  type TagsInputApi,
  type TagsInputValueChangeDetails,
} from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'
import { XIcon } from 'lucide-react'

export interface TagsInputProps extends Omit<CoreTagsInputProps, 'id' | 'onValueChange'> {
  id?: CoreTagsInputProps['id']
  onValueChange?: (details: TagsInputValueChangeDetails) => void
  children?: React.ReactNode
  className?: string
}

const TagsInputContext = React.createContext<TagsInputApi | null>(null)

export const useTagsInput = (): TagsInputApi => {
  const context = React.useContext(TagsInputContext)
  if (!context) {
    throw new Error('useTagsInput must be used within a TagsInputProvider')
  }
  return context
}

export function TagsInput({
  defaultValue,
  value,
  onValueChange,
  className,
  children,
  ...props
}: TagsInputProps) {
  const service = useMachine(tagsInputMachine, {
    id: React.useId(),
    value: value ?? defaultValue,
    onValueChange,
    ...props,
  })

  const api = tagsInputConnect(service, normalizeProps)

  return (
    <TagsInputContext.Provider value={api}>
      <div {...api.getRootProps()} className={cn('flex flex-col gap-2', className)}>
        {children}
      </div>
    </TagsInputContext.Provider>
  )
}

export function TagsInputControl({ className, children, ...props }: React.ComponentProps<'div'>) {
  const api = useTagsInput()
  return (
    <div
      {...api.getControlProps()}
      className={cn(
        'flex flex-wrap gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function TagsInputInput({ className, ...props }: React.ComponentProps<'input'>) {
  const api = useTagsInput()
  return (
    <input
      {...api.getInputProps()}
      className={cn(
        'flex-1 bg-transparent outline-none placeholder:text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}

export function TagsInputItem({
  index,
  value,
  className,
  children,
}: {
  index: string | number
  value: string
  className?: string
  children?: React.ReactNode
}) {
  const api = useTagsInput()
  const itemState = api.getItemState({ index, value })

  return (
    <div
      {...api.getItemProps({ index, value })}
      className={cn(
        'inline-flex items-center gap-1 rounded bg-secondary px-2 py-1 text-sm font-medium text-secondary-foreground hover:bg-secondary/80',
        itemState.highlighted ? 'ring-2 ring-ring ring-offset-2' : '',
        className
      )}
    >
      <span className="leading-none">{value}</span>
      <button
        {...api.getItemDeleteTriggerProps({ index, value })}
        className="ml-1 rounded-full outline-none hover:bg-background/20 focus:ring-2 focus:ring-ring focus:ring-offset-1"
      >
        <XIcon className="h-3 w-3" />
      </button>
      <input {...api.getItemInputProps({ index, value })} />
    </div>
  )
}

export function TagsInputClearTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<'button'>) {
  const api = useTagsInput()
  return (
    <button
      {...api.getClearTriggerProps()}
      className={cn('text-sm text-muted-foreground hover:text-foreground', className)}
      {...props}
    >
      {children || 'Clear'}
    </button>
  )
}

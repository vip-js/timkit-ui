'use client'

import * as React from 'react'
import {
  cn,
  tagsInputClearVariants,
  tagsInputControlVariants,
  tagsInputInputVariants,
  tagsInputItemDeleteVariants,
  tagsInputItemSelectedVariants,
  tagsInputItemVariants,
  tagsInputRootVariants,
} from '@timui/core'
import {
  tagsInputConnect,
  createTimEvent,
  tagsInputMachine,
  type TagsInputApi,
  type TagsInputProps as CoreTagsInputProps,
  type TagsInputValueChangeDetails,
} from '@timui/core'
import { useTagsInput } from './tags-input/use-tags-input'
import { TagsInputProvider, useTagsInputContext } from './tags-input/use-tags-input-context'
import { XIcon } from 'lucide-react'

// Context is imported from ./tags-input/use-tags-input-context

type TagsInputProps = CoreTagsInputProps & {
  className?: string
  children?: React.ReactNode
  onValueChangeDetails?: (details: TagsInputValueChangeDetails) => void
}

function TagsInput({
  className,
  children,
  onValueChange,
  onValueChangeDetails,
  ...props
}: TagsInputProps) {
  const api = useTagsInput({
    onValueChange,
    onValueChangeDetails,
    ...props
  })

  return (
    <TagsInputProvider value={api}>
      <div {...api.getRootProps()} className={cn(tagsInputRootVariants(), className)}>
        {children}
      </div>
    </TagsInputProvider>
  )
}

function TagsInputControl({ className, children, ...props }: React.ComponentProps<'div'>) {
  const api = useTagsInputContext()
  return (
    <div
      {...api.getControlProps()}
      className={cn(tagsInputControlVariants(), className)}
      {...props}
    >
      {children}
    </div>
  )
}

function TagsInputInput({ className, ...props }: React.ComponentProps<'input'>) {
  const api = useTagsInputContext()
  return (
    <input
      {...api.getInputProps()}
      className={cn(tagsInputInputVariants(), className)}
      {...props}
    />
  )
}

function TagsInputItem({
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
  const api = useTagsInputContext()
  const itemState = api.getItemState({ index, value })
  const isSelected =
    'selected' in itemState && typeof itemState.selected === 'boolean'
      ? itemState.selected
      : false

  return (
    <div
      {...api.getItemProps({ index, value })}
      className={cn(
        tagsInputItemVariants(),
        isSelected ? tagsInputItemSelectedVariants() : '',
        className
      )}
    >
      <span className="leading-none">{children ?? value}</span>
      <button
        {...api.getItemDeleteTriggerProps({ index, value })}
        className={tagsInputItemDeleteVariants()}
        type="button"
        aria-label="Remove tag"
      >
        <XIcon className="h-3 w-3" />
      </button>
      <input {...api.getItemInputProps({ index, value })} />
    </div>
  )
}

function TagsInputClearTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<'button'>) {
  const api = useTagsInputContext()
  return (
    <button
      {...api.getClearTriggerProps()}
      className={cn(tagsInputClearVariants(), className)}
      {...props}
    >
      {children || 'Clear'}
    </button>
  )
}

export {
  TagsInput,
  TagsInputControl,
  TagsInputInput,
  TagsInputItem,
  TagsInputClearTrigger
}

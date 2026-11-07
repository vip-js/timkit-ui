'use client'

import * as React from 'react'
import {
  cn,
  createTimEvent,
  tagsInputClearVariants,
  tagsInputConnect,
  tagsInputControlVariants,
  tagsInputInputVariants,
  tagsInputItemDeleteVariants,
  tagsInputItemSelectedVariants,
  tagsInputItemVariants,
  tagsInputMachine,
  tagsInputRootVariants,
  type TagsInputProps as CoreTagsInputProps,
  type TagsInputApi,
  type TagsInputValueChangeDetails,
} from '@timui/core'
import { XIcon } from 'lucide-react'

import { useTagsInput } from './tags-input/use-tags-input'
import { TagsInputProvider, useTagsInputContext } from './tags-input/use-tags-input-context'

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
    ...props,
  })

  const count = (api.value ?? []).filter(Boolean).length
  const tagStatus = count === 0 ? '' : count === 1 ? '1 tag' : `${count} tags`

  return (
    <TagsInputProvider value={api}>
      {tagStatus ? <p role="status">{tagStatus}</p> : null}
      <div {...api.getRootProps()} data-slot="tags-input" className={cn(tagsInputRootVariants(), className)}>
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

function TagsInputInput({
  className,
  onKeyDown,
  placeholder,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: React.ComponentProps<'input'>) {
  const api = useTagsInputContext()
  const inputProps = api.getInputProps()
  const named = Boolean(
    ariaLabel || ariaLabelledBy || inputProps['aria-label'] || inputProps['aria-labelledby']
  )
  return (
    <input
      {...inputProps}
      className={cn(tagsInputInputVariants(), className)}
      {...props}
      placeholder={placeholder ?? inputProps.placeholder}
      aria-label={named ? ariaLabel : placeholder || inputProps.placeholder || 'Add a tag'}
      onKeyDown={(event) => {
        if (api.disabled || inputProps.disabled) {
          event.preventDefault()
          return
        }
        inputProps.onKeyDown?.(event)
        onKeyDown?.(event)
      }}
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
    'selected' in itemState && typeof itemState.selected === 'boolean' ? itemState.selected : false

  return (
    <div
      {...api.getItemProps({ index, value })}
      data-highlighted={itemState.highlighted ? '' : undefined}
      className={cn(
        tagsInputItemVariants(),
        isSelected ? tagsInputItemSelectedVariants() : '',
        className
      )}
    >
      <span {...api.getItemPreviewProps({ index, value })} className="leading-none">
        {children ?? value}
      </span>
      <button
        {...api.getItemDeleteTriggerProps({ index, value })}
        className={tagsInputItemDeleteVariants()}
        type="button"
        aria-label="Remove tag"
      >
        <XIcon aria-hidden="true" className="h-3 w-3" />
      </button>
      <input {...api.getItemInputProps({ index, value })} />
    </div>
  )
}

function TagsInputClearTrigger({ className, children, ...props }: React.ComponentProps<'button'>) {
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

export { TagsInput, TagsInputControl, TagsInputInput, TagsInputItem, TagsInputClearTrigger }

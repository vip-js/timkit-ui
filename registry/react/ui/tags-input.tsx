'use client'

import * as React from 'react'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as tagsInput from '@zag-js/tags-input'

import { cva } from '../lib/cva'
import { cn } from '../lib/utils'

const tagsInputRootVariants = cva('flex flex-col gap-2')
const tagsInputControlVariants = cva(
  'flex flex-wrap gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
)
const tagsInputInputVariants = cva(
  'flex-1 bg-transparent outline-none placeholder:text-muted-foreground'
)
const tagsInputItemVariants = cva(
  'inline-flex items-center gap-1 rounded bg-secondary px-2 py-1 text-sm font-medium text-secondary-foreground hover:bg-secondary/80'
)
const tagsInputItemSelectedVariants = cva('ring-2 ring-ring ring-offset-2')
const tagsInputItemDeleteVariants = cva(
  'ml-1 rounded-full outline-none hover:bg-background/20 focus:ring-2 focus:ring-ring focus:ring-offset-1'
)
const tagsInputClearVariants = cva('text-sm text-muted-foreground hover:text-foreground')

const TagsInputContext = React.createContext<{
  api: tagsInput.Api
} | null>(null)

function useTagsInput() {
  const context = React.useContext(TagsInputContext)
  if (!context) {
    throw new Error('useTagsInput must be used within a TagsInput')
  }
  return context
}

const TagsInput = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string[]
    defaultValue?: string[]
    onValueChange?: (details: any) => void
    disabled?: boolean
    name?: string
    editable?: boolean
  }
>(
  (
    { className, value, defaultValue, onValueChange, disabled, name, editable, children, ...props },
    ref
  ) => {
    const service: tagsInput.Service = useMachine(tagsInput.machine, {
      id: React.useId(),
      value,
      defaultValue,
      disabled,
      name,
      editable,
      onValueChange,
    })
    const api = tagsInput.connect(service, normalizeProps)
    const rootProps = api.getRootProps()
    const mergedProps = mergeProps(rootProps, props) as React.HTMLAttributes<HTMLDivElement>
    const { className: mergedClassName, ...restProps } = mergedProps

    return (
      <TagsInputContext.Provider value={{ api }}>
        <div
          ref={ref}
          className={cn(tagsInputRootVariants(), className, mergedClassName)}
          {...restProps}
        >
          {children}
        </div>
      </TagsInputContext.Provider>
    )
  }
)
TagsInput.displayName = 'TagsInput'

const TagsInputControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { api } = useTagsInput()
    const controlProps = api.getControlProps()
    const mergedProps = mergeProps(controlProps, props)
    const { className: mergedClassName, ...restProps } = mergedProps

    return (
      <div
        ref={ref}
        className={cn(tagsInputControlVariants(), className, mergedClassName)}
        {...restProps}
      >
        {children}
      </div>
    )
  }
)
TagsInputControl.displayName = 'TagsInputControl'

const TagsInputInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const { api } = useTagsInput()
  const inputProps = api.getInputProps()
  const mergedProps = mergeProps(inputProps, props)
  const { className: mergedClassName, ...restProps } = mergedProps

  return (
    <input
      ref={ref}
      className={cn(tagsInputInputVariants(), className, mergedClassName)}
      {...restProps}
    />
  )
})
TagsInputInput.displayName = 'TagsInputInput'

const TagsInputItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { index: string | number; value: string }
>(({ className, index, value, children, ...props }, ref) => {
  const { api } = useTagsInput()
  const itemProps = api.getItemProps({ index, value })
  const itemState = api.getItemState({ index, value })
  const mergedProps = mergeProps(itemProps, props)
  const { className: mergedClassName, ...restProps } = mergedProps

  return (
    <div
      ref={ref}
      className={cn(
        tagsInputItemVariants(),
        itemState?.highlighted ? tagsInputItemSelectedVariants() : '',
        className,
        mergedClassName
      )}
      {...restProps}
    >
      <span className="leading-none">{children ?? value}</span>
      <button
        {...api.getItemDeleteTriggerProps({ index, value })}
        className={tagsInputItemDeleteVariants()}
        type="button"
        aria-label="Remove tag"
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
          className="h-3 w-3"
          aria-hidden="true"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
      <input {...api.getItemInputProps({ index, value })} />
    </div>
  )
})
TagsInputItem.displayName = 'TagsInputItem'

const TagsInputClearTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { api } = useTagsInput()
  const triggerProps = api.getClearTriggerProps()
  const mergedProps = mergeProps(triggerProps, props)
  const { className: mergedClassName, ...restProps } = mergedProps

  return (
    <button
      ref={ref}
      className={cn(tagsInputClearVariants(), className, mergedClassName)}
      {...restProps}
    >
      {children || 'Clear'}
    </button>
  )
})
TagsInputClearTrigger.displayName = 'TagsInputClearTrigger'

export { TagsInput, TagsInputControl, TagsInputInput, TagsInputItem, TagsInputClearTrigger }

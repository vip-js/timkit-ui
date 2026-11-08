'use client'

import * as React from 'react'
import { cn, toggleGroupVariants, toggleVariants, type ToggleVariants } from '@timui/core'
import { mergeProps } from '@zag-js/react'

import { useToggleGroup } from './toggle-group/use-toggle-group'
import { ToggleGroupProvider, useToggleGroupContext } from './toggle-group/use-toggle-group-context'

// Context is imported from ./toggle-group/use-toggle-group-context

const ToggleGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    ToggleVariants & {
      type: 'single' | 'multiple'
      value?: string | string[] | null
      defaultValue?: string | string[]
      onValueChange?: (value: string | string[]) => void
      disabled?: boolean
      loop?: boolean
    }
>(
  (
    {
      className,
      variant,
      size,
      children,
      id,
      type,
      value,
      defaultValue,
      onValueChange,
      disabled,
      loop,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const api = useToggleGroup({
      id,
      multiple: type === 'multiple',
      value,
      defaultValue,
      onValueChange,
      disabled,
      loop,
    })
    const itemValues = React.Children.toArray(children).flatMap((child) => {
      if (!React.isValidElement(child)) return []
      const itemValue = (child.props as { value?: string | number | boolean | null }).value
      return typeof itemValue === 'string' && itemValue ? [itemValue] : []
    })
    const raw = (api as { value?: string | string[] }).value
    const selected = Array.isArray(raw) ? raw.filter(Boolean) : raw ? [String(raw)] : []
    const itemStatus =
      selected.length === 0
        ? ''
        : selected.length === 1
          ? (() => {
              const index = itemValues.indexOf(selected[0] ?? '')
              return index < 0 ? '' : `Item ${index + 1} of ${itemValues.length}`
            })()
          : `${selected.length} items pressed`
    const rootProps = api.getRootProps()
    const mergedProps = mergeProps(rootProps, props) as React.HTMLAttributes<HTMLDivElement>
    const { className: mergedClassName, ...restProps } = mergedProps

    return (
      <ToggleGroupProvider
        value={{
          api,
          size,
          variant,
          type,
          disabled,
        }}
      >
        {itemStatus ? <p role="status">{itemStatus}</p> : null}
        <div
          ref={ref}
          data-slot="toggle-group"
          role="group"
          className={cn(toggleGroupVariants(), className, mergedClassName)}
          {...restProps}
          aria-label={typeof ariaLabel === 'string' && ariaLabel ? ariaLabel : 'Toggle group'}
        >
          {children}
        </div>
      </ToggleGroupProvider>
    )
  }
)
ToggleGroup.displayName = 'ToggleGroup'

const ToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const context = useToggleGroupContext()
  const api = context.api
  const itemDisabled = Boolean(props.disabled || context.disabled)
  const itemState = api?.getItemState?.({ value, disabled: itemDisabled }) ?? {
    pressed: false,
    disabled: itemDisabled,
  }
  const itemProps = api?.getItemProps?.({ value, disabled: itemDisabled }) ?? {}
  const mergedProps = mergeProps(itemProps, props)
  const { className: mergedClassName, onClick: itemOnClick, ...restProps } = mergedProps

  return (
    <button
      ref={ref}
      data-slot="toggle-group-item"
      type="button"
      data-state={itemState.pressed ? 'on' : 'off'}
      className={cn(
        toggleVariants({ variant: context?.variant, size: context?.size }),
        className,
        mergedClassName
      )}
      {...restProps}
      disabled={itemDisabled || undefined}
      onClick={(event) => {
        if (itemDisabled) return
        itemOnClick?.(event)
      }}
    >
      {children}
    </button>
  )
})
ToggleGroupItem.displayName = 'ToggleGroupItem'

export { ToggleGroup, ToggleGroupItem }

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
      value?: string | string[]
      defaultValue?: string | string[]
      onValueChange?: (value: string | string[]) => void
      disabled?: boolean
    }
>(
  (
    {
      className,
      variant,
      size,
      children,
      type,
      value,
      defaultValue,
      onValueChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const api = useToggleGroup({
      multiple: type === 'multiple',
      value,
      defaultValue,
      onValueChange,
      disabled,
    })
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
        <div
          ref={ref}
          data-slot="toggle-group"
          role="group"
          className={cn(toggleGroupVariants(), className, mergedClassName)}
          {...restProps}
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
  const itemState = api?.getItemState?.({ value, disabled: props.disabled }) ?? {
    pressed: false,
    disabled: false,
  }
  const itemProps = api?.getItemProps?.({ value, disabled: props.disabled }) ?? {}
  const mergedProps = mergeProps(itemProps, props)
  const { className: mergedClassName, ...restProps } = mergedProps

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
    >
      {children}
    </button>
  )
})
ToggleGroupItem.displayName = 'ToggleGroupItem'

export { ToggleGroup, ToggleGroupItem }

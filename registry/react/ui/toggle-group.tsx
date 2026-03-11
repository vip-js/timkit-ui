'use client'

import * as React from 'react'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as toggleGroup from '@zag-js/toggle-group'

import { cva, type VariantProps } from '../lib/cva'
import { cn } from '../lib/utils'
import { toggleVariants } from './toggle'

const toggleGroupVariants = cva('flex items-center justify-center gap-1')

const ToggleGroupContext = React.createContext<{
  api: toggleGroup.Api
  size?: VariantProps<typeof toggleVariants>['size']
  variant?: VariantProps<typeof toggleVariants>['variant']
} | null>(null)

function useToggleGroup() {
  return React.useContext(ToggleGroupContext)
}

const ToggleGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof toggleVariants> & {
      type: 'single' | 'multiple'
      value?: string | string[]
      defaultValue?: string | string[]
      onValueChange?: (value: any) => void
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
    const multiple = type === 'multiple'

    const service: toggleGroup.Service = useMachine(toggleGroup.machine, {
      id: React.useId(),
      multiple,
      value: Array.isArray(value) ? value : value ? [value] : undefined,
      defaultValue: Array.isArray(defaultValue)
        ? defaultValue
        : defaultValue
          ? [defaultValue]
          : undefined,
      disabled,
      onValueChange: (details: { value: string[] }) => {
        if (multiple) {
          onValueChange?.(details.value)
        } else {
          onValueChange?.(details.value[0] || '')
        }
      },
    })
    const api = toggleGroup.connect(service, normalizeProps)
    const rootProps = api.getRootProps()
    const mergedProps = mergeProps(rootProps, props) as React.HTMLAttributes<HTMLDivElement>
    const { className: mergedClassName, ...restProps } = mergedProps

    return (
      <ToggleGroupContext.Provider
        value={{
          api,
          size,
          variant,
        }}
      >
        <div
          ref={ref}
          className={cn(toggleGroupVariants(), className, mergedClassName)}
          {...restProps}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    )
  }
)
ToggleGroup.displayName = 'ToggleGroup'

const ToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const context = useToggleGroup()
  const api = context?.api
  const itemProps = api?.getItemProps({ value, disabled: props.disabled }) ?? {}
  const mergedProps = mergeProps(itemProps, props)
  const { className: mergedClassName, ...restProps } = mergedProps

  return (
    <button
      ref={ref}
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

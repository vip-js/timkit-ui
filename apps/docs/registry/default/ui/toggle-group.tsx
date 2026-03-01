'use client'

import * as React from 'react'
import { cn } from '@timui/core'
import { cva, type VariantProps } from 'class-variance-authority'

import { Toggle, toggleVariants } from './toggle'

const ToggleGroupContext = React.createContext<{
  size?: VariantProps<typeof toggleVariants>['size']
  variant?: VariantProps<typeof toggleVariants>['variant']
  value: string[]
  onValueChange: (value: string, pressed: boolean) => void
  type: 'single' | 'multiple'
  disabled?: boolean
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
    // Simple state management for group logic (Zag has toggleGroup but simple React state usually suffices for basic group)
    // We'll mimic Radix behavior.
    const [internalValue, setInternalValue] = React.useState<string[]>(() => {
      if (value !== undefined) return Array.isArray(value) ? value : value ? [value] : []
      if (defaultValue !== undefined)
        return Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []
      return []
    })

    const currentValue =
      value !== undefined ? (Array.isArray(value) ? value : value ? [value] : []) : internalValue

    const handleItemChange = (itemValue: string, pressed: boolean) => {
      let nextValue: string[] = []
      if (type === 'single') {
        nextValue = pressed ? [itemValue] : []
      } else {
        if (pressed) {
          nextValue = [...currentValue, itemValue]
        } else {
          nextValue = currentValue.filter((v) => v !== itemValue)
        }
      }

      if (value === undefined) {
        setInternalValue(nextValue)
      }

      if (onValueChange) {
        onValueChange(type === 'single' ? nextValue[0] || '' : nextValue)
      }
    }

    React.useEffect(() => {
      if (value !== undefined) {
        // Sync if needed, but derived state handles it
      }
    }, [value])

    return (
      <ToggleGroupContext.Provider
        value={{
          size,
          variant,
          value: currentValue,
          onValueChange: handleItemChange,
          type,
          disabled,
        }}
      >
        <div
          ref={ref}
          data-slot="toggle-group"
          role="group"
          className={cn('flex items-center justify-center gap-1', className)}
          {...props}
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
  React.ComponentProps<typeof Toggle> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const context = useToggleGroup()
  const isSelected = context?.value.includes(value)
  const isDisabled = context?.disabled || props.disabled

  return (
    <Toggle
      ref={ref}
      data-slot="toggle-group-item"
      variant={context?.variant || props.variant}
      size={context?.size || props.size}
      pressed={isSelected}
      disabled={isDisabled}
      onPressedChange={(pressed: boolean) => {
        context?.onValueChange(value, pressed)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Toggle>
  )
})
ToggleGroupItem.displayName = 'ToggleGroupItem'

export { ToggleGroup, ToggleGroupItem }

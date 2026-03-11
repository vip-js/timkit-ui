'use client'

import * as React from 'react'
import {
  cn,
  selectContentPopperVariants,
  selectContentVariants,
  selectItemVariants,
  selectLabelVariants,
  selectSeparatorVariants,
  selectTriggerIconVariants,
  selectTriggerVariants,
  selectValueVariants,
} from '@timui/core'
import { Portal } from '@zag-js/react'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'

import { useSelect, type SelectItemData, type SelectProps } from './select/use-select'
import { SelectProvider, useSelectContext } from './select/use-select-context'
import { Slot } from './slot'

const Select = (props: SelectProps) => {
  const { children } = props
  const api = useSelect(props)

  return <SelectProvider value={api}>{children}</SelectProvider>
}

type SelectTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, asChild = false, ...props }, ref) => {
    const api = useSelectContext()
    const Comp = asChild ? Slot : 'button'

    if (asChild) {
      return (
        <Comp {...api?.triggerProps} ref={ref} className={cn(className)} {...props}>
          {children}
        </Comp>
      )
    }

    return (
      <Comp
        {...api?.triggerProps}
        ref={ref}
        className={cn(selectTriggerVariants(), className)}
        {...props}
      >
        {children}
        <ChevronDownIcon className={selectTriggerIconVariants()} />
      </Comp>
    )
  }
)
SelectTrigger.displayName = 'SelectTrigger'

type SelectContentProps = React.HTMLAttributes<HTMLDivElement> & {
  position?: 'popper' | 'item-aligned'
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, position = 'popper', ...props }, ref) => {
    const api = useSelectContext()
    if (!api?.open) return null

    return (
      <Portal>
        <div {...api.positionerProps} style={{ ...api.positionerProps?.style, zIndex: 50 }}>
          <div
            {...api.contentProps}
            ref={ref}
            className={cn(
              selectContentVariants(),
              position === 'popper' && selectContentPopperVariants(),
              className
            )}
            {...props}
          >
            {children}
          </div>
        </div>
      </Portal>
    )
  }
)
SelectContent.displayName = 'SelectContent'

type SelectItemProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string
  children?: React.ReactNode
}

const isSelected = (apiValue: string | string[] | undefined, value: string) => {
  if (Array.isArray(apiValue)) return apiValue.includes(value)
  return apiValue === value
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const api = useSelectContext()
    const item = React.useMemo<SelectItemData>(
      () => ({ label: children, value }),
      [children, value]
    )

    return (
      <div
        {...api?.getItemProps?.({ item })}
        ref={ref}
        className={cn(selectItemVariants(), className)}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {isSelected(api?.value, value) ? <CheckIcon className="h-4 w-4" /> : null}
        </span>
        <span className="truncate">{children}</span>
      </div>
    )
  }
)
SelectItem.displayName = 'SelectItem'

const SelectLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(selectLabelVariants(), className)} {...props} />
  )
)
SelectLabel.displayName = 'SelectLabel'

const SelectSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(selectSeparatorVariants(), className)} {...props} />
  )
)
SelectSeparator.displayName = 'SelectSeparator'

type SelectValueProps = React.HTMLAttributes<HTMLSpanElement> & {
  placeholder?: string
}

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, placeholder, ...props }, ref) => {
    const api = useSelectContext()
    const displayValue = Array.isArray(api?.value) ? api?.value.join(', ') : api?.value
    return (
      <span ref={ref} className={cn(selectValueVariants(), className)} {...props}>
        {displayValue || placeholder}
      </span>
    )
  }
)
SelectValue.displayName = 'SelectValue'

const SelectGroup = (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />
const SelectScrollUpButton = (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />
const SelectScrollDownButton = (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}

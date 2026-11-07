'use client'

import * as React from 'react'
import {
  cn,
  selectCollection,
  selectContentPopperVariants,
  selectContentVariants,
  selectItemVariants,
  selectLabelVariants,
  selectSeparatorVariants,
  selectTriggerIconVariants,
  selectTriggerVariants,
  selectValueVariants,
} from '@timui/core'
import { mergeProps, Portal } from '@zag-js/react'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'

import { useSelect, type SelectItemData, type SelectProps } from './select/use-select'
import { SelectProvider, useSelectContext } from './select/use-select-context'
import { Slot } from './slot'
import { useReturnFocus } from './use-return-focus'

const Select = (props: SelectProps) => {
  const { children, collection: externalCollection } = props
  const [items, setItems] = React.useState<SelectItemData[]>([])
  const [itemLabels, setItemLabels] = React.useState<Record<string, string>>({})
  const collection = React.useMemo(
    () => externalCollection ?? selectCollection<SelectItemData>({ items }),
    [externalCollection, items]
  )
  const api = useSelect({ ...props, collection })
  const raw = (api as { value?: string | string[] }).value
  const selected = Array.isArray(raw) ? raw.filter(Boolean) : raw ? [String(raw)] : []
  const optionStatus =
    selected.length === 0
      ? ''
      : selected.length === 1
        ? (() => {
            const index = items.findIndex((item) => item.value === selected[0])
            return index < 0 ? '' : `Option ${index + 1} of ${items.length}`
          })()
        : `${selected.length} options selected`

  const registerItem = React.useCallback(
    (item: SelectItemData) => {
      if (!externalCollection) {
        setItems((prev) => {
          const index = prev.findIndex((entry) => entry.value === item.value)
          if (index === -1) return [...prev, item]
          if (prev[index] === item) return prev
          const next = [...prev]
          next[index] = item
          return next
        })
      }
      setItemLabels((prev) => {
        if (prev[item.value] === item.label) return prev
        return { ...prev, [item.value]: item.label }
      })
    },
    [externalCollection]
  )

  const unregisterItem = React.useCallback(
    (value: string) => {
      if (!externalCollection) {
        setItems((prev) => prev.filter((entry) => entry.value !== value))
      }
      setItemLabels((prev) => {
        if (!(value in prev)) return prev
        const next = { ...prev }
        delete next[value]
        return next
      })
    },
    [externalCollection]
  )

  const getItemLabel = React.useCallback(
    (value: string) => {
      if (externalCollection) return externalCollection.find(value)?.label
      return itemLabels[value]
    },
    [externalCollection, itemLabels]
  )

  const contextValue = React.useMemo(
    () => ({ ...api, registerItem, unregisterItem, getItemLabel, placeholder: props.placeholder }),
    [api, getItemLabel, props.placeholder, registerItem, unregisterItem]
  )

  return (
    <SelectProvider value={contextValue}>
      {optionStatus ? <p role="status">{optionStatus}</p> : null}
      {children}
    </SelectProvider>
  )
}

type SelectTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, asChild = false, ...props }, ref) => {
    const api = useSelectContext()
    const rememberTrigger = useReturnFocus(!!api.open)
    const Comp = asChild ? Slot : 'button'
    const triggerProps = api.getTriggerProps?.() ?? {}
    const mergedProps = mergeProps(triggerProps, props)
    const triggerRef = (node: HTMLButtonElement | null) => {
      rememberTrigger(node)
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    }

    if (asChild) {
      return (
        <Comp ref={triggerRef} className={cn(className)} {...mergedProps}>
          {children}
        </Comp>
      )
    }

    return (
      <Comp ref={triggerRef} className={cn(selectTriggerVariants(), className)} {...mergedProps} data-slot="select-trigger">
        {children}
        <ChevronDownIcon aria-hidden="true" className={selectTriggerIconVariants()} />
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
    const positionerProps = api.getPositionerProps?.() ?? {}
    const contentProps = api.getContentProps?.() ?? {}
    const mergedProps = mergeProps(contentProps, props) as React.HTMLAttributes<HTMLDivElement>

    return (
      <Portal>
        <div {...positionerProps} style={{ ...positionerProps.style, zIndex: 50 }}>
          <div
            ref={ref}
            className={cn(
              selectContentVariants(),
              position === 'popper' && selectContentPopperVariants(),
              className
            )}
            {...mergedProps}
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
  label?: string
  disabled?: boolean
  children?: React.ReactNode
}

const isSelected = (apiValue: string | string[] | undefined, value: string) => {
  if (Array.isArray(apiValue)) return apiValue.includes(value)
  return apiValue === value
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, label, disabled, ...props }, ref) => {
    const api = useSelectContext()
    const itemLabel = React.useMemo(() => {
      if (label) return label
      if (typeof children === 'string' || typeof children === 'number') return String(children)
      return value
    }, [children, label, value])
    const item = React.useMemo<SelectItemData>(
      () => ({ label: itemLabel, value, disabled }),
      [disabled, itemLabel, value]
    )
    const itemProps = api?.getItemProps?.({ item }) ?? {}
    const mergedProps = mergeProps(itemProps, props) as React.HTMLAttributes<HTMLDivElement>
    const registerItem = api.registerItem
    const unregisterItem = api.unregisterItem

    React.useEffect(() => {
      registerItem?.(item)
      return () => {
        unregisterItem?.(item.value)
      }
    }, [item, registerItem, unregisterItem])

    return (
      <div
        ref={ref}
        className={cn(selectItemVariants(), className)}
        {...mergedProps}
        data-slot="select-item"
        data-disabled={disabled || undefined}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {isSelected(api?.value, value) ? <CheckIcon aria-hidden="true" className="h-4 w-4" /> : null}
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
    const values = api?.value ?? []
    const fallbackValue = values.map((value) => api.getItemLabel?.(value) ?? value).join(', ')
    const hasRegisteredLabel = values.some((value) => api.getItemLabel?.(value) !== undefined)
    const resolvedPlaceholder = placeholder ?? api.placeholder
    const displayValue =
      (hasRegisteredLabel ? fallbackValue : api?.valueAsString || fallbackValue) || resolvedPlaceholder
    return (
      <span ref={ref} className={cn(selectValueVariants(), className)} {...props}>
        {displayValue}
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

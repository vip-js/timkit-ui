'use client'

import * as React from 'react'
import type { SelectProps as CoreSelectProps } from '@timui/core'
import {
  cn,
  selectCollection,
  selectConnect,
  selectContentPopperVariants,
  selectContentVariants,
  selectItemVariants,
  selectLabelVariants,
  selectMachine,
  selectSeparatorVariants,
  selectTriggerIconVariants,
  selectTriggerVariants,
  selectValueVariants,
} from '@timui/core'
import { mergeProps, normalizeProps, Portal, useMachine } from '@zag-js/react'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'

import { Slot } from './slot'

type SelectItemData = {
  label: string
  value: string
  disabled?: boolean
}

type SelectProps = {
  id?: string
  collection?: ReturnType<typeof selectCollection<SelectItemData>>
  value?: string
  defaultValue?: string
  disabled?: boolean
  required?: boolean
  name?: string
  open?: boolean
  defaultOpen?: boolean
  onValueChange?(value: string): void
  onOpenChange?: CoreSelectProps['onOpenChange']
  children?: React.ReactNode
}

type SelectApiLike = {
  open?: boolean
  value?: string[]
  valueAsString?: string
  getTriggerProps?: () => React.HTMLAttributes<HTMLElement>
  getPositionerProps?: () => React.HTMLAttributes<HTMLElement> & { style?: React.CSSProperties }
  getContentProps?: () => React.HTMLAttributes<HTMLElement>
  getItemProps?: (options: { item: SelectItemData }) => React.HTMLAttributes<HTMLElement>
  registerItem?: (item: SelectItemData) => void
  unregisterItem?: (value: string) => void
  getItemLabel?: (value: string) => string | undefined
}

const SelectContext = React.createContext<SelectApiLike | null>(null)

function useSelectContext() {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error('useSelectContext must be used within a Select component')
  }
  return context
}

function useSelect(props: SelectProps) {
  const generatedId = React.useId()
  const selectId = props.id ?? generatedId
  const value = props.value !== undefined ? [props.value] : undefined
  const defaultValue =
    props.value === undefined && props.defaultValue !== undefined ? [props.defaultValue] : undefined
  const service = useMachine(selectMachine, {
    id: selectId,
    collection: props.collection ?? selectCollection<SelectItemData>({ items: [] }),
    value,
    defaultValue,
    disabled: props.disabled,
    required: props.required,
    name: props.name,
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
    onValueChange(details) {
      props.onValueChange?.(details.value?.[0] ?? '')
    },
  })

  return React.useMemo(() => selectConnect(service, normalizeProps), [service])
}

const Select = (props: SelectProps) => {
  const { children, collection: externalCollection } = props
  const internalCollectionRef = React.useRef(selectCollection<SelectItemData>({ items: [] }))
  const [itemLabels, setItemLabels] = React.useState<Record<string, string>>({})
  const collection = externalCollection ?? internalCollectionRef.current
  const api = useSelect({ ...props, collection })

  const registerItem = React.useCallback(
    (item: SelectItemData) => {
      if (!externalCollection) {
        internalCollectionRef.current.upsert(item.value, item)
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
        internalCollectionRef.current.remove(value)
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
    () => ({ ...api, registerItem, unregisterItem, getItemLabel }),
    [api, getItemLabel, registerItem, unregisterItem]
  )

  return <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>
}

type SelectTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, asChild = false, ...props }, ref) => {
    const api = useSelectContext()
    const Comp = asChild ? Slot : 'button'
    const triggerProps = api.getTriggerProps?.() ?? {}
    const mergedProps = mergeProps(triggerProps, props)

    if (asChild) {
      return (
        <Comp ref={ref} className={cn(className)} {...mergedProps}>
          {children}
        </Comp>
      )
    }

    return (
      <Comp ref={ref} className={cn(selectTriggerVariants(), className)} {...mergedProps}>
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
      <div ref={ref} className={cn(selectItemVariants(), className)} {...mergedProps}>
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
    const values = api?.value ?? []
    const fallbackValue = values.map((value) => api.getItemLabel?.(value) ?? value).join(', ')
    const hasRegisteredLabel = values.some((value) => api.getItemLabel?.(value) !== undefined)
    const displayValue =
      (hasRegisteredLabel ? fallbackValue : api?.valueAsString || fallbackValue) || placeholder
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

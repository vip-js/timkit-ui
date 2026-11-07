'use client'

import * as React from 'react'
import {
  cn,
  comboboxContentVariants,
  comboboxControlVariants,
  comboboxEmptyVariants,
  comboboxGroupLabelVariants,
  comboboxInputVariants,
  comboboxItemIndicatorVariants,
  comboboxItemTextVariants,
  comboboxItemVariants,
  comboboxLabelVariants,
  comboboxListVariants,
  comboboxPositionerVariants,
  comboboxRootVariants,
  type ItemGroupLabelProps,
  type ItemGroupProps,
  type ItemProps,
} from '@timui/core'
import type { CollectionItem } from '@zag-js/collection'

import { useCombobox, type ComboboxProps } from './combobox/use-combobox'
import { ComboboxProvider, useComboboxContext } from './combobox/use-combobox-context'

const ComboboxLabelPresence = React.createContext<{
  labelled: boolean
  setLabelled: (labelled: boolean) => void
} | null>(null)

function Combobox(props: ComboboxProps) {
  const { className, children } = props
  const api = useCombobox(props)
  const [labelled, setLabelled] = React.useState(false)
  const presence = React.useMemo(() => ({ labelled, setLabelled }), [labelled])

  return (
    <ComboboxProvider value={api}>
      <ComboboxLabelPresence.Provider value={presence}>
        <div {...api.getRootProps()} data-slot="combobox" className={cn(comboboxRootVariants(), className)}>
          {children}
        </div>
      </ComboboxLabelPresence.Provider>
    </ComboboxProvider>
  )
}

function ComboboxLabel({ className, ...props }: React.ComponentProps<'label'>) {
  const api = useComboboxContext()
  const presence = React.useContext(ComboboxLabelPresence)
  const setLabelled = presence?.setLabelled
  React.useLayoutEffect(() => {
    setLabelled?.(true)
    return () => setLabelled?.(false)
  }, [setLabelled])
  return (
    <label {...api.getLabelProps()} className={cn(comboboxLabelVariants(), className)} {...props} />
  )
}

function ComboboxControl({ className, children, ...props }: React.ComponentProps<'div'>) {
  const api = useComboboxContext()
  return (
    <div {...api.getControlProps()} className={cn(comboboxControlVariants(), className)} {...props}>
      {children}
    </div>
  )
}

function ComboboxInput({
  className,
  placeholder,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: React.ComponentProps<'input'>) {
  const api = useComboboxContext()
  const presence = React.useContext(ComboboxLabelPresence)
  const inputProps = api.getInputProps()
  const named =
    Boolean(ariaLabel || ariaLabelledBy || inputProps['aria-label'] || inputProps['aria-labelledby']) ||
    presence?.labelled === true
  return (
    <input
      {...inputProps}
      className={cn(comboboxInputVariants(), className)}
      {...props}
      placeholder={placeholder}
      aria-label={named ? ariaLabel : placeholder || inputProps.placeholder || 'Choose an item'}
    />
  )
}

function ComboboxContent({ className, children, ...props }: React.ComponentProps<'div'>) {
  const api = useComboboxContext()
  if (!api.open) return null
  const positionerProps = api.getPositionerProps()
  const contentProps = api.getContentProps()

  return (
    <div {...positionerProps} className={cn(comboboxPositionerVariants())}>
      <div {...contentProps} className={cn(comboboxContentVariants(), className)} {...props}>
        {children}
      </div>
    </div>
  )
}

function ComboboxList({ className, children, ...props }: React.ComponentProps<'div'>) {
  const api = useComboboxContext()
  return (
    <div {...api.getListProps()} className={cn(comboboxListVariants(), className)} {...props}>
      {children}
    </div>
  )
}

function ComboboxItem({
  item,
  className,
  children,
  ...props
}: { item: CollectionItem } & React.ComponentProps<'div'>) {
  const api = useComboboxContext()
  const itemState = api.getItemState({ item } as ItemProps)
  const query = api.inputValue.trim().toLowerCase()
  const label = String((item as { label?: string }).label ?? item.value ?? '').toLowerCase()
  if (query && !label.includes(query)) return null

  return (
    <div
      {...api.getItemProps({ item } as ItemProps)}
      className={cn(comboboxItemVariants(), className)}
      data-highlighted={itemState.highlighted || undefined}
      data-selected={itemState.selected || undefined}
      {...props}
    >
      <span
        {...api.getItemIndicatorProps({ item } as ItemProps)}
        className={comboboxItemIndicatorVariants()}
      >
        {itemState.selected ? '✓' : null}
      </span>
      <span {...api.getItemTextProps({ item } as ItemProps)} className={comboboxItemTextVariants()}>
        {children ?? item.value}
      </span>
    </div>
  )
}

function ComboboxGroup({
  id,
  className,
  children,
  ...props
}: ItemGroupProps & React.ComponentProps<'div'>) {
  const api = useComboboxContext()
  return (
    <div {...api.getItemGroupProps({ id })} className={cn(className)} {...props}>
      {children}
    </div>
  )
}

function ComboboxGroupLabel({
  htmlFor,
  className,
  ...props
}: ItemGroupLabelProps & React.ComponentProps<'div'>) {
  const api = useComboboxContext()
  return (
    <div
      {...api.getItemGroupLabelProps({ htmlFor })}
      className={cn(comboboxGroupLabelVariants(), className)}
      {...props}
    />
  )
}

function ComboboxEmpty({ className, children, ...props }: React.ComponentProps<'div'>) {
  const api = useComboboxContext()
  if (api.collection.size > 0 || api.inputValue.trim().length === 0) return null
  return (
    <div role="status" className={cn(comboboxEmptyVariants(), className)} {...props}>
      {children}
    </div>
  )
}

export {
  Combobox,
  ComboboxLabel,
  ComboboxControl,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxEmpty,
  useCombobox,
}

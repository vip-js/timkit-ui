'use client'

import * as React from 'react'
import type { CollectionItem } from '@zag-js/collection'
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
import { ComboboxProvider, useComboboxContext } from './combobox/use-combobox-context'
import { useCombobox, type ComboboxProps } from './combobox/use-combobox'

function Combobox(props: ComboboxProps) {
  const { className, children } = props
  const api = useCombobox(props)

  return (
    <ComboboxProvider value={api}>
      <div {...api.getRootProps()} className={cn(comboboxRootVariants(), className)}>
        {children}
      </div>
    </ComboboxProvider>
  )
}

function ComboboxLabel({ className, ...props }: React.ComponentProps<'label'>) {
  const api = useComboboxContext()
  return (
    <label {...api.getLabelProps()} className={cn(comboboxLabelVariants(), className)} {...props} />
  )
}

function ComboboxControl({ className, children, ...props }: React.ComponentProps<'div'>) {
  const api = useComboboxContext()
  return (
    <div
      {...api.getControlProps()}
      className={cn(comboboxControlVariants(), className)}
      {...props}
    >
      {children}
    </div>
  )
}

function ComboboxInput({ className, ...props }: React.ComponentProps<'input'>) {
  const api = useComboboxContext()
  return (
    <input
      {...api.getInputProps()}
      className={cn(comboboxInputVariants(), className)}
      {...props}
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
      <div
        {...contentProps}
        className={cn(comboboxContentVariants(), className)}
        {...props}
      >
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

function ComboboxItem({ item, className, children, ...props }: { item: CollectionItem } & React.ComponentProps<'div'>) {
  const api = useComboboxContext()
  const itemState = api.getItemState({ item } as ItemProps)

  return (
    <div
      {...api.getItemProps({ item } as ItemProps)}
      className={cn(comboboxItemVariants(), className)}
      data-highlighted={itemState.highlighted || undefined}
      data-selected={itemState.selected || undefined}
      {...props}
    >
      <span {...api.getItemIndicatorProps({ item } as ItemProps)} className={comboboxItemIndicatorVariants()}>
        {itemState.selected ? '✓' : null}
      </span>
      <span {...api.getItemTextProps({ item } as ItemProps)} className={comboboxItemTextVariants()}>
        {children ?? item.value}
      </span>
    </div>
  )
}

function ComboboxGroup({ id, className, children, ...props }: ItemGroupProps & React.ComponentProps<'div'>) {
  const api = useComboboxContext()
  return (
    <div
      {...api.getItemGroupProps({ id })}
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  )
}

function ComboboxGroupLabel({ htmlFor, className, ...props }: ItemGroupLabelProps & React.ComponentProps<'div'>) {
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
  return (
    <div className={cn(comboboxEmptyVariants(), className)} {...props}>
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

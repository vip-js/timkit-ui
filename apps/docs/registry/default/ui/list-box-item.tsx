'use client'

import * as React from 'react'
import { cn, listBoxItemVariants } from '@timui/core'
import { mergeProps } from '@zag-js/react'

import { useListBoxContext } from './list-box/use-list-box-context'

interface ListBoxItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id'> {
  id?: string
  value?: string
  isDisabled?: boolean
  textValue?: string
}

const getTextValue = (node: React.ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getTextValue).join(' ').trim()
  return ''
}

const ListBoxItem = React.forwardRef<HTMLDivElement, ListBoxItemProps>(
  ({ id, value, isDisabled, textValue, className, children, ...props }, ref) => {
    const generatedValue = React.useId()
    const resolvedValue = value ?? id ?? generatedValue
    const textContent = getTextValue(children)
    const resolvedLabel = textValue ?? (textContent || resolvedValue)
    const { api, registerItem, unregisterItem } = useListBoxContext()

    const item = React.useMemo(
      () => ({
        label: resolvedLabel,
        value: resolvedValue,
        disabled: isDisabled,
      }),
      [isDisabled, resolvedLabel, resolvedValue]
    )

    React.useEffect(() => {
      registerItem(item)
      return () => unregisterItem(item.value)
    }, [item, registerItem, unregisterItem])

    const itemState = api.getItemState({ item })
    const mergedItemProps = mergeProps(
      api.getItemProps({ item }),
      props
    ) as React.HTMLAttributes<HTMLDivElement>
    const { className: mergedClassName, ...restItemProps } = mergedItemProps

    return (
      <div
        ref={ref}
        data-slot="list-box-item"
        data-selected={itemState.selected ? 'true' : undefined}
        className={cn(listBoxItemVariants(), className, mergedClassName)}
        {...restItemProps}
      >
        {children}
      </div>
    )
  }
)
ListBoxItem.displayName = 'ListBoxItem'

export { ListBoxItem }

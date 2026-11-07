'use client'

import * as React from 'react'
import { cn, listBoxListVariants, listBoxRootVariants } from '@timui/core'
import { mergeProps } from '@zag-js/react'

import { useListBox, type ListBoxSelectionMode } from './list-box/use-list-box'
import { ListBoxProvider } from './list-box/use-list-box-context'

interface ListBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string
  selectionMode?: ListBoxSelectionMode
  defaultSelectedKeys?: Iterable<React.Key>
  selectedKeys?: Iterable<React.Key> | null
  disabled?: boolean
  required?: boolean
  name?: string
  onSelectionChange?: (keys: Set<React.Key>) => void
}

const ListBox = React.forwardRef<HTMLDivElement, ListBoxProps>(
  (
    {
      id,
      selectionMode,
      defaultSelectedKeys,
      selectedKeys,
      disabled,
      required,
      name,
      onSelectionChange,
      className,
      children,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const { api, registerItem, unregisterItem } = useListBox({
      id,
      selectionMode,
      defaultSelectedKeys,
      selectedKeys,
      disabled,
      required,
      name,
      onSelectionChange,
    })

    const rootProps = api.getRootProps()
    const mergedListProps = mergeProps(api.getListProps(), props) as React.HTMLAttributes<HTMLDivElement>
    const { className: mergedClassName, onKeyDown, ...restListProps } = mergedListProps
    const onListKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event)
      if (disabled || event.defaultPrevented) return
      const items = ((api.collection as { items?: Array<{ value?: string; label?: string; disabled?: boolean }> }).items ?? [])
        .filter((item) => item.value && !item.disabled)
      if (!items.length) return
      const current = items.findIndex((item) => item.value === api.highlightedValue)
      const highlight = (value?: string) => {
        if (!value) return
        event.preventDefault()
        api.setHighlightValue(value)
      }
      if (event.key === 'Home' || event.key === 'End') {
        highlight(items[event.key === 'Home' ? 0 : items.length - 1]?.value)
        return
      }
      if (/^[a-z]$/i.test(event.key)) {
        const letter = event.key.toLowerCase()
        for (let step = 1; step <= items.length; step += 1) {
          const next = items[(current + step) % items.length]
          const name = String(next?.label || next?.value || '').trim().toLowerCase()
          if (!name.startsWith(letter)) continue
          highlight(next?.value)
          return
        }
        return
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        const start = current < 0 ? (event.key === 'ArrowDown' ? -1 : 0) : current
        const delta = event.key === 'ArrowDown' ? 1 : -1
        const next = items[(start + delta + items.length) % items.length]
        api.setHighlightValue(next.value ?? '')
        return
      }
      if (event.key !== 'Enter' && event.key !== ' ') return
      const item = items[current]
      if (!item?.value) return
      event.preventDefault()
      api.selectValue(item.value)
    }

    return (
      <ListBoxProvider value={{ api, registerItem, unregisterItem }}>
        <div {...rootProps} data-slot="list-box-root" className={cn(listBoxRootVariants())}>
          <div
            ref={ref}
            data-slot="list-box"
            className={cn(listBoxListVariants(), className, mergedClassName)}
            {...restListProps}
            aria-label={typeof ariaLabel === 'string' && ariaLabel ? ariaLabel : 'List'}
            onKeyDown={onListKey}
          >
            {children}
          </div>
        </div>
      </ListBoxProvider>
    )
  }
)
ListBox.displayName = 'ListBox'

export { ListBox }

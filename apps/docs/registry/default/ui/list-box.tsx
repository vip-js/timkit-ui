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
  selectedKeys?: Iterable<React.Key>
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
    const mergedListProps = mergeProps(
      api.getListProps(),
      props
    ) as React.HTMLAttributes<HTMLDivElement>
    const { className: mergedClassName, ...restListProps } = mergedListProps

    return (
      <ListBoxProvider value={{ api, registerItem, unregisterItem }}>
        <div {...rootProps} data-slot="list-box-root" className={cn(listBoxRootVariants())}>
          <div
            ref={ref}
            data-slot="list-box"
            className={cn(listBoxListVariants(), className, mergedClassName)}
            {...restListProps}
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

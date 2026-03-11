'use client'

import * as React from 'react'
import { ItemInstance } from '@headless-tree/core'
import type { AssertNoExtraKeys, TreeProps as CoreTreeProps, TreeContainerApi } from '@timui/core'
import {
  cn,
  treeDragLineVariants,
  treeItemLabelIconVariants,
  treeItemLabelVariants,
  treeItemVariants,
  treeVariants,
} from '@timui/core'
import { ChevronDownIcon } from 'lucide-react'

import { Slot } from './slot'

interface TreeContextValue<T = Record<string, never>> {
  indent: number
  currentItem?: ItemInstance<T>
  tree?: TreeContainerApi
}

const TreeContext = React.createContext<TreeContextValue>({
  indent: 20,
  currentItem: undefined,
  tree: undefined,
})

function useTreeContext<T = Record<string, never>>() {
  return React.useContext(TreeContext) as TreeContextValue<T>
}

type TreeProps = CoreTreeProps & React.HTMLAttributes<HTMLDivElement>
type _TreePropsGuard = AssertNoExtraKeys<
  TreeProps,
  CoreTreeProps & React.HTMLAttributes<HTMLDivElement>
>

function Tree({ indent = 20, tree, className, ...props }: TreeProps) {
  const containerProps = tree?.getContainerProps?.() ?? {}
  const mergedProps = { ...props, ...containerProps }

  // Extract style from mergedProps to merge with our custom styles
  const { style: propStyle, ...otherProps } = mergedProps

  // Merge styles
  const mergedStyle = {
    ...propStyle,
    '--tree-indent': `${indent}px`,
  } as React.CSSProperties

  return (
    <TreeContext.Provider value={{ indent, tree }}>
      <div
        data-slot="tree"
        style={mergedStyle}
        className={cn(treeVariants(), className)}
        {...otherProps}
      />
    </TreeContext.Provider>
  )
}

interface TreeItemProps<T = Record<string, never>> extends React.HTMLAttributes<HTMLButtonElement> {
  item: ItemInstance<T>
  indent?: number
  asChild?: boolean
}

function TreeItem<T = Record<string, never>>({
  item,
  className,
  asChild,
  children,
  ...props
}: Omit<TreeItemProps<T>, 'indent'>) {
  const { indent } = useTreeContext<T>()

  const itemProps = typeof item.getProps === 'function' ? item.getProps() : {}
  const mergedProps = { ...props, ...itemProps }

  // Extract style from mergedProps to merge with our custom styles
  const { style: propStyle, ...otherProps } = mergedProps

  // Merge styles
  const mergedStyle = {
    ...propStyle,
    '--tree-padding': `${item.getItemMeta().level * indent}px`,
  } as React.CSSProperties

  const Comp = asChild ? Slot : 'button'

  return (
    <TreeContext.Provider
      value={{ indent, currentItem: item as ItemInstance<Record<string, never>> }}
    >
      <Comp
        data-slot="tree-item"
        style={mergedStyle}
        className={cn(treeItemVariants(), className)}
        data-focus={typeof item.isFocused === 'function' ? item.isFocused() || false : undefined}
        data-folder={typeof item.isFolder === 'function' ? item.isFolder() || false : undefined}
        data-selected={
          typeof item.isSelected === 'function' ? item.isSelected() || false : undefined
        }
        data-drag-target={
          typeof item.isDragTarget === 'function' ? item.isDragTarget() || false : undefined
        }
        data-search-match={
          typeof item.isMatchingSearch === 'function' ? item.isMatchingSearch() || false : undefined
        }
        aria-expanded={item.isExpanded()}
        {...otherProps}
      >
        {children}
      </Comp>
    </TreeContext.Provider>
  )
}

interface TreeItemLabelProps<
  T = Record<string, never>,
> extends React.HTMLAttributes<HTMLSpanElement> {
  item?: ItemInstance<T>
}

function TreeItemLabel<T = Record<string, never>>({
  item: propItem,
  children,
  className,
  ...props
}: TreeItemLabelProps<T>) {
  const { currentItem } = useTreeContext<T>()
  const item = propItem || currentItem

  if (!item) {
    console.warn('TreeItemLabel: No item provided via props or context')
    return null
  }

  return (
    <span data-slot="tree-item-label" className={cn(treeItemLabelVariants(), className)} {...props}>
      {item.isFolder() && <ChevronDownIcon className={treeItemLabelIconVariants()} />}
      {children || (typeof item.getItemName === 'function' ? item.getItemName() : null)}
    </span>
  )
}

function TreeDragLine({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { tree } = useTreeContext()

  if (!tree || typeof tree.getDragLineStyle !== 'function') {
    console.warn(
      'TreeDragLine: No tree provided via context or tree does not have getDragLineStyle method'
    )
    return null
  }

  const dragLine = tree.getDragLineStyle()
  return (
    <div
      style={dragLine ?? undefined}
      className={cn(treeDragLineVariants(), className)}
      {...props}
    />
  )
}

export { Tree, TreeItem, TreeItemLabel, TreeDragLine }

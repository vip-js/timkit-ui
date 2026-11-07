'use client'

import * as React from 'react'
import { ItemInstance } from '@headless-tree/core'
import type { AssertNoExtraKeys, TreeNode, TreeProps as CoreTreeProps, TreeContainerApi } from '@timui/core'
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

const visibleRows = (nodes: TreeNode[], expanded: Set<string>, level = 0): Array<{ node: TreeNode; level: number }> => {
  const rows: Array<{ node: TreeNode; level: number }> = []
  nodes.forEach((node) => {
    rows.push({ node, level })
    if (expanded.has(node.id) && node.children?.length) rows.push(...visibleRows(node.children, expanded, level + 1))
  })
  return rows
}

function Tree({
  indent = 20,
  tree,
  data,
  disabled = false,
  selected: selectedProp,
  onSelectedChange,
  className,
  children,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: TreeProps) {
  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set())
  const [selectedState, setSelected] = React.useState(selectedProp ?? '')
  const [focusId, setFocusId] = React.useState('')
  const itemRefs = React.useRef(new Map<string, HTMLButtonElement>())
  const selected = selectedProp === undefined ? selectedState : selectedProp
  const rows = data?.length ? visibleRows(data, expanded) : []
  const selectedIndex = selected ? rows.findIndex((row) => row.node.id === selected) : -1
  const nodeStatus = selectedIndex < 0 ? '' : `Node ${selectedIndex + 1} of ${rows.length}`
  const activeId = rows.some((row) => row.node.id === focusId) ? focusId : (rows[0]?.node.id ?? '')
  const focusRow = (id: string) => {
    setFocusId(id)
    itemRefs.current.get(id)?.focus()
  }
  const onItemKey = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (disabled) return
    const row = rows[index]
    if (!row) return
    if (/^[a-z]$/i.test(event.key)) {
      const letter = event.key.toLowerCase()
      for (let step = 1; step <= rows.length; step += 1) {
        const next = rows[(index + step) % rows.length]
        if (!next?.node.label.trim().toLowerCase().startsWith(letter)) continue
        if (next.node.id !== row.node.id) {
          event.preventDefault()
          focusRow(next.node.id)
        }
        return
      }
    }
    if (event.key === 'Home' || event.key === 'End') {
      const next = rows[event.key === 'Home' ? 0 : rows.length - 1]
      if (!next || next.node.id === row.node.id) return
      event.preventDefault()
      focusRow(next.node.id)
      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const next = rows[event.key === 'ArrowDown' ? index + 1 : index - 1]
      if (!next) return
      event.preventDefault()
      focusRow(next.node.id)
      return
    }
    if (event.key === 'ArrowRight') {
      if (!row.node.children?.length) return
      event.preventDefault()
      if (!expanded.has(row.node.id)) {
        setExpanded((current) => new Set(current).add(row.node.id))
        return
      }
      const child = rows[index + 1]
      if (child && child.level > row.level) focusRow(child.node.id)
      return
    }
    if (event.key === 'ArrowLeft') {
      if (row.node.children?.length && expanded.has(row.node.id)) {
        event.preventDefault()
        setExpanded((current) => {
          const next = new Set(current)
          next.delete(row.node.id)
          return next
        })
        return
      }
      for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
        if (rows[cursor].level < row.level) {
          event.preventDefault()
          focusRow(rows[cursor].node.id)
          return
        }
      }
    }
  }
  const onRow = (node: TreeNode) => {
    if (disabled) return
    if (node.children?.length) {
      setExpanded((current) => {
        const next = new Set(current)
        if (next.has(node.id)) next.delete(node.id)
        else next.add(node.id)
        return next
      })
      return
    }
    if (selectedProp === undefined) setSelected(node.id)
    onSelectedChange?.(node.id)
  }
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
        role="tree"
        aria-disabled={disabled || undefined}
        aria-labelledby={ariaLabelledBy}
        aria-label={
          ariaLabelledBy ? undefined : typeof ariaLabel === 'string' && ariaLabel ? ariaLabel : 'Tree'
        }
      >
        {nodeStatus ? <p role="status">{nodeStatus}</p> : null}
        {rows.map(({ node, level }, index) => (
          <button
            key={node.id}
            ref={(element) => {
              if (element) itemRefs.current.set(node.id, element)
              else itemRefs.current.delete(node.id)
            }}
            type="button"
            role="treeitem"
            data-slot="tree-item"
            data-selected={selected === node.id ? '' : undefined}
            aria-level={level + 1}
            aria-selected={selected === node.id}
            aria-expanded={node.children?.length ? expanded.has(node.id) : undefined}
            tabIndex={disabled || node.id !== activeId ? -1 : 0}
            disabled={disabled}
            style={{ paddingLeft: level * indent }}
            onClick={() => onRow(node)}
            onKeyDown={(event) => onItemKey(event, index)}
          >
            {node.label}
          </button>
        ))}
        {rows.length ? null : children}
      </div>
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
      {item.isFolder() && <ChevronDownIcon aria-hidden="true" className={treeItemLabelIconVariants()} />}
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

'use client'

import React, { useCallback, useMemo, useState } from 'react'
import type {
  AssertNoExtraKeys,
  CheckboxTreeNode,
  CheckboxTreeProps as CoreCheckboxTreeProps,
} from '@timui/core'
import {
  cn,
  checkboxTreeChecked,
  initialCheckboxTreeChecked,
  toggleCheckboxTree,
} from '@timui/core'

type CheckboxTreeProps = CoreCheckboxTreeProps<React.ReactNode>
type _CheckboxTreePropsGuard = AssertNoExtraKeys<
  CheckboxTreeProps,
  CoreCheckboxTreeProps<React.ReactNode>
>

function useCheckboxTree(
  initialTree: CheckboxTreeNode,
  checkedKeys?: string[] | null,
  onCheckedKeysChange?: (checkedKeys: string[]) => void
) {
  const initialCheckedNodes = useMemo(() => initialCheckboxTreeChecked(initialTree), [initialTree])
  const [checkedNodes, setCheckedNodes] = useState<Set<string>>(initialCheckedNodes)
  const controlled = checkedKeys !== undefined
  const current = controlled ? new Set(checkedKeys ?? []) : checkedNodes

  const isChecked = useCallback(
    (node: CheckboxTreeNode): boolean | 'indeterminate' => checkboxTreeChecked(node, current),
    [current]
  )

  const handleCheck = useCallback(
    (node: CheckboxTreeNode) => {
      if (node.disabled === true) return
      const source = controlled ? new Set(checkedKeys ?? []) : checkedNodes
      const next = toggleCheckboxTree(node, source)
      if (!controlled) setCheckedNodes(next)
      onCheckedKeysChange?.([...next])
    },
    [checkedKeys, checkedNodes, controlled, onCheckedKeysChange]
  )

  return { isChecked, handleCheck, checkedCount: current.size }
}

export function CheckboxTree({
  tree,
  renderNode,
  className,
  checkedKeys,
  onCheckedKeysChange,
}: CheckboxTreeProps) {
  const { isChecked, handleCheck, checkedCount } = useCheckboxTree(tree, checkedKeys, onCheckedKeysChange)

  const renderTreeNode = (node: CheckboxTreeNode): React.ReactNode => {
    const children = node.children?.map((child) => (
      <React.Fragment key={child.id}>{renderTreeNode(child)}</React.Fragment>
    ))

    return renderNode({
      node,
      isChecked: isChecked(node),
      onCheckedChange: () => handleCheck(node),
      children,
    }) as React.ReactNode
  }

  const rendered = renderTreeNode(tree)
  const checkStatus = checkedCount > 1 ? `${checkedCount} checked` : checkedCount === 1 ? '1 checked' : ''
  return (
    <div data-slot="checkbox-tree" className={cn(className)}>
      {checkStatus ? <p role="status">{checkStatus}</p> : null}
      {rendered}
    </div>
  )
}

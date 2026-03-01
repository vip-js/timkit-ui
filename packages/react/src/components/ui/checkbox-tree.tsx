/**
 * IMPORTANT: This component was built for demo purposes only and has not been tested in production.
 * It serves as a proof of concept for a checkbox tree implementation.
 * If you're interested in collaborating to create a more robust, production-ready
 * headless component, your contributions are welcome!
 */

'use client'

import React, { useCallback, useMemo, useState } from 'react'
import type {
  AssertNoExtraKeys,
  CheckboxTreeNode,
  CheckboxTreeProps as CoreCheckboxTreeProps,
} from '@timui/core'

type CheckboxTreeProps = CoreCheckboxTreeProps<React.ReactNode>
type _CheckboxTreePropsGuard = AssertNoExtraKeys<
  CheckboxTreeProps,
  CoreCheckboxTreeProps<React.ReactNode>
>

function useCheckboxTree(initialTree: CheckboxTreeNode) {
  const initialCheckedNodes = useMemo(() => {
    const checkedSet = new Set<string>()
    const initializeCheckedNodes = (node: CheckboxTreeNode) => {
      if (node.defaultChecked) {
        checkedSet.add(node.id)
      }
      node.children?.forEach(initializeCheckedNodes)
    }
    initializeCheckedNodes(initialTree)
    return checkedSet
  }, [initialTree])

  const [checkedNodes, setCheckedNodes] = useState<Set<string>>(initialCheckedNodes)

  const isChecked = useCallback(
    (node: CheckboxTreeNode): boolean | 'indeterminate' => {
      if (!node.children) {
        return checkedNodes.has(node.id)
      }

      const childrenChecked = node.children.map((child) => isChecked(child))
      if (childrenChecked.every((status) => status === true)) {
        return true
      }
      if (childrenChecked.some((status) => status === true || status === 'indeterminate')) {
        return 'indeterminate'
      }
      return false
    },
    [checkedNodes]
  )

  const handleCheck = useCallback(
    (node: CheckboxTreeNode) => {
      const newCheckedNodes = new Set(checkedNodes)

      const toggleNode = (n: CheckboxTreeNode, check: boolean) => {
        if (check) {
          newCheckedNodes.add(n.id)
        } else {
          newCheckedNodes.delete(n.id)
        }
        n.children?.forEach((child) => toggleNode(child, check))
      }

      const currentStatus = isChecked(node)
      const newCheck = currentStatus !== true

      toggleNode(node, newCheck)
      setCheckedNodes(newCheckedNodes)
    },
    [checkedNodes, isChecked]
  )

  return { isChecked, handleCheck }
}

export function CheckboxTree({ tree, renderNode }: CheckboxTreeProps) {
  const { isChecked, handleCheck } = useCheckboxTree(tree)

  const renderTreeNode = (node: CheckboxTreeNode): React.ReactNode => {
    const children = node.children?.map(renderTreeNode)

    return renderNode({
      node,
      isChecked: isChecked(node),
      onCheckedChange: () => handleCheck(node),
      children,
    }) as React.ReactNode
  }

  return renderTreeNode(tree)
}

'use client'

import { CheckboxTree } from '@timui/react'

const tree = {
  id: 'all',
  label: 'All',
  children: [
    { id: 'one', label: 'One' },
    { id: 'two', label: 'Two' },
  ],
}

export default function Component() {
  return (
    <CheckboxTree
      className="space-y-1"
      tree={tree}
      renderNode={({ node, isChecked, onCheckedChange, children }) => (
        <div>
          <button type="button" aria-pressed={isChecked === true} onClick={onCheckedChange}>
            {node.label}
          </button>
          <div className="ps-4">{children}</div>
        </div>
      )}
    />
  )
}

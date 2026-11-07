import { describe, expect, it } from 'vitest'

import { checkboxTreeChecked, toggleCheckboxTree } from './selection'

const tree = {
  id: 'root',
  label: 'Root',
  children: [
    { id: 'a', label: 'A' },
    { id: 'b', label: 'B', disabled: true },
  ],
}

describe('checkbox tree selection', () => {
  it('checks enabled descendants and leaves a disabled node alone', () => {
    const checked = toggleCheckboxTree(tree, new Set())
    expect([...checked].sort()).toEqual(['a', 'root'])
    expect(checkboxTreeChecked(tree, checked)).toBe(true)
    expect(checkboxTreeChecked(tree.children[1], checked)).toBe(false)

    const cleared = toggleCheckboxTree(tree, checked)
    expect([...cleared]).toEqual([])
  })

  it('ignores a check on a disabled node', () => {
    const disabled = { id: 'b', label: 'B', disabled: true }
    expect([...toggleCheckboxTree(disabled, new Set(['keep']))]).toEqual(['keep'])
  })
})
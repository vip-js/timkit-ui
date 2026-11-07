import type { CheckboxTreeNode } from './props'

const enabledChildren = (node: CheckboxTreeNode) =>
  (node.children ?? []).filter((child) => child.disabled !== true)

export function checkboxTreeChecked(
  node: CheckboxTreeNode,
  checked: ReadonlySet<string>
): boolean | 'indeterminate' {
  const children = enabledChildren(node)
  if (children.length === 0) return checked.has(node.id)
  const states = children.map((child) => checkboxTreeChecked(child, checked))
  if (states.every((state) => state === true)) return true
  if (states.some((state) => state === true || state === 'indeterminate')) return 'indeterminate'
  return false
}

export function toggleCheckboxTree(node: CheckboxTreeNode, checked: ReadonlySet<string>): Set<string> {
  if (node.disabled === true) return new Set(checked)
  const next = new Set(checked)
  const turnOn = checkboxTreeChecked(node, checked) !== true
  const walk = (current: CheckboxTreeNode) => {
    if (current.disabled === true) return
    if (turnOn) next.add(current.id)
    else next.delete(current.id)
    current.children?.forEach(walk)
  }
  walk(node)
  return next
}

export function initialCheckboxTreeChecked(node: CheckboxTreeNode, checked = new Set<string>()) {
  if (node.defaultChecked) checked.add(node.id)
  node.children?.forEach((child) => initialCheckboxTreeChecked(child, checked))
  return checked
}

export function findCheckboxTreeNode(nodes: CheckboxTreeNode[], id: string): CheckboxTreeNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node
    const child = node.children ? findCheckboxTreeNode(node.children, id) : undefined
    if (child) return child
  }
  return undefined
}

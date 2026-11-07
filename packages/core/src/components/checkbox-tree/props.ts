export type CheckboxTreeNode = {
  /**
   * A unique identifier for the component.
   */
  id: string
  /**
   * The text label displayed alongside or within the component.
   */
  label: string
  /**
   * The default checked state of the component when initially rendered.
   */
  defaultChecked?: boolean
  /**
   * When true, checking this node does nothing, and a parent check leaves it unchanged.
   */
  disabled?: boolean
  children?: CheckboxTreeNode[]
}
export type CheckboxTreeProps<T> = {
  /**
   * The node tree or hierarchical data structure.
   */
  tree: CheckboxTreeNode
  /**
   * Classes for the optional wrapper. Omitted className keeps the previous root.
   */
  className?: string
  /**
   * The controlled ids of the checked nodes.
   */
  checkedKeys?: string[]
  /**
   * Called with the next checked ids. A controlled value stays until the parent applies it.
   */
  onCheckedKeysChange?: (checkedKeys: string[]) => void
  renderNode: (props: {
    node: CheckboxTreeNode
    isChecked: boolean | 'indeterminate'
    /**
     * Callback fired when the state of the checked property changes.
     */
    onCheckedChange: () => void
    children: T
  }) => T
}

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
  children?: CheckboxTreeNode[]
}
export type CheckboxTreeProps<T> = {
  /**
   * The node tree or hierarchical data structure.
   */
  tree: CheckboxTreeNode
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

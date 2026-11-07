import type { TreeInstance } from '@headless-tree/core'

export type TreeNode = {
  /**
   * A unique identifier for the component.
   */
  id: string
  /**
   * The text label displayed alongside or within the component.
   */
  label: string
  children?: TreeNode[]
}

export type TreeProps = {
  /**
   * The structured array of data used to render the component.
   */
  data?: TreeNode[]
  /**
   * The visual indentation size for nested items.
   */
  indent?: number
  /**
   * The node tree or hierarchical data structure.
   */
  tree?: TreeContainerApi
  /**
   * Whether expanding and selecting are ignored.
   */
  disabled?: boolean
  /**
   * The controlled id of the selected node.
   */
  selected?: string
  /**
   * Called with the next selected id. A controlled value stays until the parent applies it.
   */
  onSelectedChange?: (selected: string) => void
}

export type TreeContainerApi = TreeInstance<TreeNode>

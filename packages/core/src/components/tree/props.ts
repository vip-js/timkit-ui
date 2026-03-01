import type { TreeInstance } from '@headless-tree/core'

export type TreeNode = {
    id: string
    label: string
    children?: TreeNode[]
}

export type TreeProps = {
    data?: TreeNode[]
    indent?: number
    tree?: TreeContainerApi
}

export type TreeContainerApi = TreeInstance<TreeNode>

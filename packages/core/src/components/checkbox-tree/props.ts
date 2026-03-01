export type CheckboxTreeNode = {
    id: string
    label: string
    defaultChecked?: boolean
    children?: CheckboxTreeNode[]
}
export type CheckboxTreeProps<T> = {
    tree: CheckboxTreeNode
    renderNode: (props: {
        node: CheckboxTreeNode
        isChecked: boolean | 'indeterminate'
        onCheckedChange: () => void
        children: T
    }) => T
}

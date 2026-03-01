type CheckboxTreeNode = {
  id: string
  label: string
  checked?: boolean
  disabled?: boolean
  children?: CheckboxTreeNode[]
}

type FlatNode = CheckboxTreeNode & { level: number }

const flattenNodes = (nodes: CheckboxTreeNode[], level = 0, acc: FlatNode[] = []) => {
  nodes.forEach((node) => {
    acc.push({
      ...node,
      level,
    })
    if (Array.isArray(node.children) && node.children.length > 0) {
      flattenNodes(node.children, level + 1, acc)
    }
  })
  return acc
}

Component({
  options: {
    styleIsolation: 'apply-shared',
  },

  properties: {
    nodes: {
      type: Array,
      value: [],
    },
    checkedKeys: {
      type: Array,
      value: [],
    },
    extClass: {
      type: String,
      value: '',
    },
  },

  data: {
    flatNodes: [] as FlatNode[],
    checkedMap: {} as Record<string, boolean>,
  },

  lifetimes: {
    attached() {
      this.syncFromProps()
    },
  },

  observers: {
    'nodes, checkedKeys': function () {
      this.syncFromProps()
    },
  },

  methods: {
    syncFromProps() {
      const flatNodes = flattenNodes((this.properties.nodes || []) as CheckboxTreeNode[])
      const checkedMap: Record<string, boolean> = {}
      ;(this.properties.checkedKeys as string[]).forEach((id) => {
        checkedMap[id] = true
      })
      flatNodes.forEach((node) => {
        if (node.checked && checkedMap[node.id] === undefined) {
          checkedMap[node.id] = true
        }
      })
      this.setData({ flatNodes, checkedMap })
    },

    onToggle(e: WechatMiniprogram.BaseEvent) {
      const id = e.currentTarget.dataset.id as string
      if (!id) return
      const checkedMap = { ...(this.data.checkedMap || {}) }
      checkedMap[id] = !checkedMap[id]
      const checkedKeys = Object.keys(checkedMap).filter((key) => checkedMap[key])
      this.setData({ checkedMap })
      this.triggerEvent('change', {
        checkedKeys,
      })
      this.triggerEvent('update:checkedKeys', checkedKeys)
    },
  },
})

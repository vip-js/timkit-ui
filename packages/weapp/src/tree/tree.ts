type TreeNode = {
  id: string
  label: string
  children?: TreeNode[]
}

type FlatNode = TreeNode & { level: number }

const flatten = (nodes: TreeNode[], level = 0, acc: FlatNode[] = []) => {
  nodes.forEach((node) => {
    acc.push({ ...node, level })
    if (Array.isArray(node.children) && node.children.length > 0) {
      flatten(node.children, level + 1, acc)
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
    expandedKeys: {
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
    expandedMap: {} as Record<string, boolean>,
  },

  lifetimes: {
    attached() {
      this.syncData()
    },
  },

  observers: {
    'nodes, expandedKeys': function () {
      this.syncData()
    },
  },

  methods: {
    syncData() {
      const flatNodes = flatten((this.properties.nodes || []) as TreeNode[])
      const expandedMap: Record<string, boolean> = {}
      ;(this.properties.expandedKeys as string[]).forEach((id) => {
        expandedMap[id] = true
      })
      this.setData({ flatNodes, expandedMap })
    },

    hasChildren(node: FlatNode) {
      return Array.isArray(node.children) && node.children.length > 0
    },

    onToggle(e: WechatMiniprogram.BaseEvent) {
      const id = String(e.currentTarget.dataset.id || '')
      if (!id) return
      const expandedMap = { ...(this.data.expandedMap || {}) }
      expandedMap[id] = !expandedMap[id]
      const expandedKeys = Object.keys(expandedMap).filter((key) => expandedMap[key])
      this.setData({ expandedMap })
      this.triggerEvent('expandedChange', { expandedKeys })
      this.triggerEvent('update:expandedKeys', expandedKeys)
    },

    onSelect(e: WechatMiniprogram.BaseEvent) {
      const id = String(e.currentTarget.dataset.id || '')
      if (!id) return
      this.triggerEvent('select', { id })
    },
  },
})

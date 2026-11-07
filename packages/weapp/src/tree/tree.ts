import { createControl, type ControlState } from '@timui/core'

import { commitControl } from '../utils/control'

type TreeNode = {
  id: string
  label: string
  children?: TreeNode[]
}

type FlatNode = TreeNode & { level: number; pad: number }

const visibleNodes = (
  nodes: TreeNode[],
  expanded: Record<string, boolean>,
  level = 0,
  acc: FlatNode[] = []
) => {
  nodes.forEach((node) => {
    acc.push({ ...node, level })
    if (expanded[node.id] && Array.isArray(node.children) && node.children.length > 0) {
      visibleNodes(node.children, expanded, level + 1, acc)
    }
  })
  return acc
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    nodes: {
      type: Array,
      value: [],
    },
    data: {
      type: Array,
      value: [],
    },
    expandedKeys: {
      type: null,
      value: null,
    },
    defaultExpandedKeys: {
      type: null,
      value: null,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    selected: {
      type: null,
      value: null,
    },
    defaultSelected: {
      type: null,
      value: null,
    },
    indent: {
      type: Number,
      value: 20,
    },
    extClass: {
      type: String,
      value: '',
    },
    'aria-label': {
      type: String,
      value: '',
    },
    'aria-labelledby': {
      type: String,
      value: '',
    },
  },

  data: {
    flatNodes: [] as FlatNode[],
    expandedMap: {} as Record<string, boolean>,
    selected: '',
    nodeStatus: '',
    focusId: '',
    ariaLabel: '',
    labelledBy: '',
    control: createControl() as ControlState,
  },

  lifetimes: {
    attached() {
      if (this.properties.expandedKeys == null && Array.isArray(this.properties.defaultExpandedKeys)) {
        const expandedMap: Record<string, boolean> = {}
        for (const id of this.properties.defaultExpandedKeys as string[]) expandedMap[String(id)] = true
        this.data.expandedMap = expandedMap
      }
      this.syncData()
      const passed = this.properties.selected
      const source = passed == null ? this.properties.defaultSelected : passed
      const selected = source == null || source === '' ? '' : String(source)
      this.setData({
        ariaLabel: String(this.properties['aria-label'] || ''),
        labelledBy: String(this.properties['aria-labelledby'] || ''),
        ...(selected ? { selected } : {}),
        nodeStatus: this.nodeText(selected, this.data.flatNodes || []),
      })
    },
  },

  observers: {
    'nodes, data, expandedKeys, indent': function () {
      this.syncData()
    },
    expandedKeys(next: unknown) {
      if (next == null) return
      this.syncData()
    },
    'aria-label'(next: string) {
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
    'aria-labelledby'(next: string) {
      const labelledBy = String(next || '')
      if (labelledBy === this.data.labelledBy) return
      this.setData({ labelledBy })
    },
    selected(next: unknown) {
      if (next == null) return
      const selected = String(next)
      if (selected === String(this.data.selected ?? '')) return
      this.setData({ selected, nodeStatus: this.nodeText(selected, this.data.flatNodes || []) })
    },
  },

  methods: {
    nodeText(selected: string, rows: Array<{ id: string }>) {
      if (!selected) return ''
      const index = rows.findIndex((node) => node.id === selected)
      return index < 0 ? '' : `Node ${index + 1} of ${rows.length}`
    },
    syncData() {
      if (this.properties.expandedKeys == null) {
        this.render(this.data.expandedMap || {})
        return
      }
      const expandedMap: Record<string, boolean> = {}
      ;(this.properties.expandedKeys as string[]).forEach((id) => {
        expandedMap[String(id)] = true
      })
      this.render(expandedMap)
    },

    render(expandedMap: Record<string, boolean>) {
      const source = this.properties.nodes?.length ? this.properties.nodes : this.properties.data || []
      const indent = Number(this.properties.indent)
      const pad = Number.isFinite(indent) ? indent : 20
      const flatNodes = visibleNodes(source as TreeNode[], expandedMap).map((node) => ({
        ...node,
        pad: node.level * pad,
      }))
      const current = String(this.data.focusId || '')
      const focusId = flatNodes.some((node) => node.id === current) ? current : (flatNodes[0]?.id ?? '')
      this.setData({
        flatNodes,
        expandedMap,
        focusId,
        nodeStatus: this.nodeText(String(this.data.selected || ''), flatNodes),
      })
    },

    hasChildren(node: FlatNode) {
      return Array.isArray(node.children) && node.children.length > 0
    },

    onToggleKey(e: WechatMiniprogram.BaseEvent & { detail?: { key?: string } }) {
      const key = String(e.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onToggle(e)
    },
    onSelectKey(e: WechatMiniprogram.BaseEvent & { detail?: { key?: string } }) {
      const key = String(e.detail?.key || '')
      if (key === 'Enter' || key === ' ') {
        this.onSelect(e)
        return
      }
      if (this.properties.disabled) return
      const nodes = (this.data.flatNodes || []) as FlatNode[]
      const id = String(e.currentTarget.dataset.id || this.data.focusId || '')
      const index = nodes.findIndex((node) => node.id === id)
      if (index < 0) return
      const row = nodes[index]
      if (/^[a-z]$/i.test(key)) {
        const letter = key.toLowerCase()
        for (let step = 1; step <= nodes.length; step += 1) {
          const next = nodes[(index + step) % nodes.length]
          if (!String(next?.label || '').trim().toLowerCase().startsWith(letter)) continue
          if (next.id !== row.id) this.setData({ focusId: next.id })
          return
        }
      }
      if (key === 'Home' || key === 'End') {
        const next = nodes[key === 'Home' ? 0 : nodes.length - 1]
        if (next && next.id !== row.id) this.setData({ focusId: next.id })
        return
      }
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        const next = nodes[key === 'ArrowDown' ? index + 1 : index - 1]
        if (next) this.setData({ focusId: next.id })
        return
      }
      if (key === 'ArrowRight') {
        if (!this.hasChildren(row)) return
        if (!this.data.expandedMap?.[row.id]) {
          this.onToggle(e)
          return
        }
        const child = nodes[index + 1]
        if (child && child.level > row.level) this.setData({ focusId: child.id })
        return
      }
      if (key === 'ArrowLeft') {
        if (this.hasChildren(row) && this.data.expandedMap?.[row.id]) {
          this.onToggle(e)
          return
        }
        for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
          if (nodes[cursor].level < row.level) {
            this.setData({ focusId: nodes[cursor].id })
            return
          }
        }
      }
    },
    onToggle(e: WechatMiniprogram.BaseEvent) {
      const id = String(e.currentTarget.dataset.id || '')
      const next = commitControl(this, this.data.expandedMap?.[id] ? 'close' : 'open')
      if (!id || next.disabled) return
      const expandedMap = { ...(this.data.expandedMap || {}) }
      expandedMap[id] = !expandedMap[id]
      const expandedKeys = Object.keys(expandedMap).filter((key) => expandedMap[key])
      if (this.properties.expandedKeys != null) {
        this.triggerEvent('expandedChange', { expandedKeys })
        this.triggerEvent('update:expandedKeys', expandedKeys)
        return
      }
      this.render(expandedMap)
      this.triggerEvent('expandedChange', { expandedKeys })
      this.triggerEvent('update:expandedKeys', expandedKeys)
    },

    onSelect(e: WechatMiniprogram.BaseEvent) {
      const id = String(e.currentTarget.dataset.id || '')
      const next = commitControl(this, 'select', id)
      if (!id || next.disabled) return
      if (this.properties.selected == null) this.setData({ selected: id })
      this.triggerEvent('select', { id })
    },
  },
})

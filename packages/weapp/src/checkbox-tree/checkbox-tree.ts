import { findCheckboxTreeNode, toggleCheckboxTree, type CheckboxTreeNode as CoreNode } from '@timui/core'

import { emitTimEvent } from '../utils'

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
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    nodes: {
      type: Array,
      value: [],
    },
    checkedKeys: {
      type: null,
      value: null,
    },
    id: {
      type: String,
      value: 'checkbox-tree',
    },
    extClass: {
      type: String,
      value: '',
    },
    'aria-label': { type: String, value: '' },
    'aria-labelledby': { type: String, value: '' },
  },

  data: {
    flatNodes: [] as FlatNode[],
    checkedMap: {} as Record<string, boolean>,
    selected: [] as string[],
    checkStatus: '',
    ariaLabel: '',
    labelledBy: '',
  },

  lifetimes: {
    attached() {
      this.syncFromProps()
      this.setData({
        ariaLabel: String(this.properties['aria-label'] || ''),
        labelledBy: String(this.properties['aria-labelledby'] || ''),
      })
    },
  },

  observers: {
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
    'nodes, checkedKeys': function () {
      this.syncFromProps()
    },
    checkedKeys(next: unknown) {
      if (next == null) return
      this.applyCheckedKeys(next)
    },
  },

  methods: {
    checkText(selected: string[]) {
      if (selected.length > 1) return `${selected.length} checked`
      if (selected.length === 1) return '1 checked'
      return ''
    },
    syncFromProps() {
      const flatNodes = flattenNodes((this.properties.nodes || []) as CheckboxTreeNode[])
      const checkedMap: Record<string, boolean> = {}
      const passed = this.properties.checkedKeys
      if (Array.isArray(passed)) {
        passed.forEach((id) => {
          checkedMap[String(id)] = true
        })
      } else {
        flatNodes.forEach((node) => {
          if (node.checked) checkedMap[node.id] = true
        })
      }
      const selected = Object.keys(checkedMap).filter((key) => checkedMap[key])
      this.setData({ flatNodes, checkedMap, selected, checkStatus: this.checkText(selected) })
    },

    applyCheckedKeys(next: unknown) {
      const keys = Array.isArray(next) ? next.map((item) => String(item)) : []
      const current = Object.keys(this.data.checkedMap || {})
        .filter((key) => this.data.checkedMap[key])
        .sort()
        .join('\0')
      if (keys.slice().sort().join('\0') === current) return
      const checkedMap: Record<string, boolean> = {}
      keys.forEach((id) => {
        checkedMap[id] = true
      })
      this.setData({ checkedMap, selected: keys, checkStatus: this.checkText(keys) })
    },

    onToggleKey(e: WechatMiniprogram.BaseEvent & { detail?: { key?: string } }) {
      const key = String(e?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onToggle(e)
    },
    onToggle(e: WechatMiniprogram.BaseEvent) {
      const id = String(e.currentTarget.dataset.id || '')
      const node = findCheckboxTreeNode((this.properties.nodes || []) as CoreNode[], id)
      if (!id || !node || node.disabled) return
      const current = new Set(
        Object.keys(this.data.checkedMap || {}).filter((key) => this.data.checkedMap[key])
      )
      const next = toggleCheckboxTree(node, current)
      const checkedMap: Record<string, boolean> = {}
      next.forEach((key) => {
        checkedMap[key] = true
      })
      const checkedKeys = [...next]
      if (this.properties.checkedKeys != null) {
        emitTimEvent(this, 'change', 'change', this.properties.id || 'checkbox-tree', {
          checkedKeys,
        })
        this.triggerEvent('update:checkedKeys', checkedKeys)
        return
      }
      this.setData({ checkedMap, selected: checkedKeys, checkStatus: this.checkText(checkedKeys) })
      emitTimEvent(this, 'change', 'change', this.properties.id || 'checkbox-tree', {
        checkedKeys,
      })
      this.triggerEvent('update:checkedKeys', checkedKeys)
    },
  },
})

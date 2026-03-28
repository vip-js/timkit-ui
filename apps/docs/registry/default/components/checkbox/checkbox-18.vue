<script setup lang="ts">
import { h, type VNodeChild } from 'vue'
import type { CheckboxTreeNode } from '@timui/core'
import { Checkbox } from '@timui/vue'
import { CheckboxTree } from '@timui/vue'
import { Label } from '@timui/vue'

const id = 'checkbox-18'

const initialTree: CheckboxTreeNode = {
  id: '1',
  label: 'Natural Wonders',
  children: [
    { id: '2', label: 'Mountains', defaultChecked: true },
    {
      id: '3',
      label: 'Waterfalls',
      children: [
        { id: '4', label: 'Niagara Falls' },
        { id: '5', label: 'Angel Falls', defaultChecked: true },
      ],
    },
    { id: '6', label: 'Grand Canyon' },
  ],
}

function renderNode({
  node,
  isChecked,
  onCheckedChange,
  children,
}: {
  node: CheckboxTreeNode
  isChecked: boolean | 'indeterminate'
  onCheckedChange: () => void
  children: VNodeChild[] | undefined
}) {
  const nodeId = `${id}-${node.id}`
  return h('div', { class: 'space-y-3' }, [
    h('div', { class: 'flex items-center gap-2' }, [
      h(Checkbox, {
        id: nodeId,
        checked: isChecked,
        onCheckedChange,
      }),
      h(Label, { htmlFor: nodeId }, () => node.label),
    ]),
    children ? h('div', { class: 'ms-6 space-y-3' }, children as VNodeChild[]) : null,
  ])
}
</script>

<template>
  <div class="space-y-3">
    <CheckboxTree :tree="initialTree" :renderNode="renderNode" />
  </div>
</template>

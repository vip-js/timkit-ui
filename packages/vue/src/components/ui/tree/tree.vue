<script setup lang="ts">
import { type HTMLAttributes, computed, nextTick, ref, toRef, useAttrs } from "vue";
import { cn, treeVariants } from '@timui/core';
import { provideTreeContext, type TreeApi } from "./tree-context";

type TreeDataNode = { id: string; label: string; children?: TreeDataNode[] }

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    indent?: number;
    tree?: TreeApi;
    data?: TreeDataNode[];
    disabled?: boolean;
    selected?: string;
  }>(),
  {
    indent: 20,
    disabled: false,
  }
);

type TreeRow = { id: string; label: string; level: number; folder: boolean }
const emit = defineEmits<{
  (e: "selectedChange", selected: string): void;
}>();

const expanded = ref<Record<string, boolean>>({})
const focusId = ref('')
const itemEls = new Map<string, HTMLButtonElement>()
const selectedState = ref(props.selected ?? '')
const selected = computed(() => (props.selected === undefined ? selectedState.value : props.selected))

const rows = computed<TreeRow[]>(() => {
  const acc: TreeRow[] = []
  const walk = (nodes: TreeDataNode[], level: number) => {
    nodes.forEach((node) => {
      const folder = Array.isArray(node.children) && node.children.length > 0
      acc.push({ id: node.id, label: node.label, level, folder })
      if (folder && expanded.value[node.id]) walk(node.children || [], level + 1)
    })
  }
  if (props.data?.length) walk(props.data, 0)
  return acc
})
const nodeStatus = computed(() => {
  const active = selected.value
  const index = active ? rows.value.findIndex((row) => row.id === active) : -1
  return index < 0 ? '' : `Node ${index + 1} of ${rows.value.length}`
})

const activeId = computed(() =>
  rows.value.some((row) => row.id === focusId.value) ? focusId.value : rows.value[0]?.id ?? ''
)
const setItemRef = (id: string, element: unknown) => {
  if (element instanceof HTMLButtonElement) itemEls.set(id, element)
  else itemEls.delete(id)
}
const bindItem = (id: string) => (element: unknown) => setItemRef(id, element)
const focusRow = (id: string) => {
  focusId.value = id
  void nextTick(() => itemEls.get(id)?.focus())
}
const onItemKey = (event: KeyboardEvent, index: number) => {
  if (props.disabled) return
  const row = rows.value[index]
  if (!row) return
  if (/^[a-z]$/i.test(event.key)) {
    const letter = event.key.toLowerCase()
    for (let step = 1; step <= rows.value.length; step += 1) {
      const next = rows.value[(index + step) % rows.value.length]
      if (!next?.label.trim().toLowerCase().startsWith(letter)) continue
      if (next.id !== row.id) {
        event.preventDefault()
        focusRow(next.id)
      }
      return
    }
  }
  if (event.key === 'Home' || event.key === 'End') {
    const next = rows.value[event.key === 'Home' ? 0 : rows.value.length - 1]
    if (!next || next.id === row.id) return
    event.preventDefault()
    focusRow(next.id)
    return
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    const next = rows.value[event.key === 'ArrowDown' ? index + 1 : index - 1]
    if (!next) return
    event.preventDefault()
    focusRow(next.id)
    return
  }
  if (event.key === 'ArrowRight') {
    if (!row.folder) return
    event.preventDefault()
    if (!expanded.value[row.id]) {
      expanded.value = { ...expanded.value, [row.id]: true }
      return
    }
    const child = rows.value[index + 1]
    if (child && child.level > row.level) focusRow(child.id)
    return
  }
  if (event.key === 'ArrowLeft') {
    if (row.folder && expanded.value[row.id]) {
      event.preventDefault()
      expanded.value = { ...expanded.value, [row.id]: false }
      return
    }
    for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
      if (rows.value[cursor].level < row.level) {
        event.preventDefault()
        focusRow(rows.value[cursor].id)
        return
      }
    }
  }
}
const onRow = (row: TreeRow) => {
  if (props.disabled) return
  if (row.folder) {
    expanded.value = { ...expanded.value, [row.id]: !expanded.value[row.id] }
    return
  }
  if (props.selected === undefined) selectedState.value = row.id
  emit("selectedChange", row.id)
}

type TreeBindValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, string | number>;

type TreeContainerProps = {
  style?: Record<string, string | number>;
  [key: string]: TreeBindValue;
};

provideTreeContext({
  indent: toRef(props, "indent"),
  tree: props.tree,
});

const attrs = useAttrs();
const ariaLabel = computed(() => {
  if (typeof attrs['aria-labelledby'] === 'string' && attrs['aria-labelledby']) return undefined
  return typeof attrs['aria-label'] === 'string' && attrs['aria-label'] ? attrs['aria-label'] : 'Tree'
});
const containerProps = computed<TreeContainerProps>(() => {
  return props.tree && typeof props.tree.getContainerProps === "function"
    ? (props.tree.getContainerProps() as TreeContainerProps)
    : {};
});

const mergedStyle = computed(() => {
  const style = containerProps.value.style || {};
  return {
    ...style,
    "--tree-indent": `${props.indent}px`,
  };
});
</script>

<template>
  <div
    data-slot="tree"
    :style="mergedStyle"
    :class="cn(treeVariants(), props.class)"
    v-bind="containerProps"
    role="tree"
    :aria-disabled="props.disabled || undefined"
    :aria-label="ariaLabel"
  >
    <p v-if="nodeStatus" role="status">{{ nodeStatus }}</p>
    <button
      v-for="(row, index) in rows"
      :key="row.id"
      :ref="bindItem(row.id)"
      type="button"
      role="treeitem"
      data-slot="tree-item"
      :data-selected="selected === row.id ? '' : undefined"
      :aria-level="row.level + 1"
      :aria-selected="selected === row.id"
      :aria-expanded="row.folder ? (expanded[row.id] ? 'true' : 'false') : undefined"
      :tabindex="props.disabled || row.id !== activeId ? -1 : 0"
      :disabled="props.disabled || undefined"
      :style="{ paddingLeft: `${row.level * props.indent}px` }"
      @click="onRow(row)"
      @keydown="onItemKey($event, index)"
    >
      {{ row.label }}
    </button>
    <slot v-if="!rows.length" />
  </div>
</template>

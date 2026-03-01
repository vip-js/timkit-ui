<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { ChevronDown } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { injectTreeItemContext } from "./tree-context";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  item?: any;
}>();

const context = injectTreeItemContext("TreeItemLabel");

const item = computed(() => props.item || context.currentItem);

const isFolder = computed(() =>
  item.value && typeof item.value.isFolder === "function"
    ? item.value.isFolder()
    : false
);
const itemName = computed(() =>
  item.value && typeof item.value.getItemName === "function"
    ? item.value.getItemName()
    : null
);
</script>

<template>
  <span
    v-if="item"
    data-slot="tree-item-label"
    :class="
      cn(
        'in-focus-visible:ring-ring/50 bg-background hover:bg-accent in-data-[selected=true]:bg-accent in-data-[selected=true]:text-accent-foreground in-data-[drag-target=true]:bg-accent flex items-center gap-1 rounded-sm px-2 py-1.5 text-sm transition-colors not-in-data-[folder=true]:ps-7 in-focus-visible:ring-[3px] in-data-[search-match=true]:bg-blue-50! [&_svg]:pointer-events-none [&_svg]:shrink-0',
        props.class
      )
    "
  >
    <template v-if="isFolder">
      <ChevronDown
        class="text-muted-foreground size-4 in-aria-[expanded=false]:-rotate-90"
      />
    </template>
    <slot>
      {{ itemName }}
    </slot>
  </span>
</template>

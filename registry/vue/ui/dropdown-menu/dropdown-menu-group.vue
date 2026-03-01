<script setup lang="ts">
import { inject, type HTMLAttributes, computed } from "vue";
import { dropdownMenuContextKey } from '../../lib/injection-keys'

const props = defineProps<{ id: string; class?: HTMLAttributes["class"] }>();
const api = inject(dropdownMenuContextKey);

const groupProps = computed(() => api?.value?.getGroupProps({ id: props.id }) ?? {});
</script>

<template>
  <div v-bind="groupProps" :class="props.class">
    <slot />
  </div>
</template>

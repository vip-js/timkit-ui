<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import { dropdownMenuContextKey } from '../../lib/injection-keys'

const props = defineProps<{
  value?: string;
  disabled?: boolean;
  class?: HTMLAttributes["class"];
}>();

const api = inject(dropdownMenuContextKey);

// Zag JS menu machine handles submenus via triggers.
// We just need a wrapper component if necessary, or just use slots.
// But Zag typically needs structure.
// Actually, Zag uses the same machine for submenus or just nested triggers.
</script>

<template>
  <div :class="props.class">
    <slot />
  </div>
</template>

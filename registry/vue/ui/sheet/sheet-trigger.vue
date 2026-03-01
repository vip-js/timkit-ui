<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cn } from "../../lib/utils";
import { sheetContextKey } from '../../lib/injection-keys'

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(sheetContextKey);
</script>

<template>
  <button v-bind="api.getTriggerProps()" type="button" :class="props.class">
    <slot />
  </button>
</template>

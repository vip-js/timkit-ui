<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cn } from "../../lib/utils";
import { tooltipContextKey } from '../../lib/injection-keys'

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(tooltipContextKey);
</script>

<template>
  <button v-bind="api.getTriggerProps()" :class="props.class">
    <slot />
  </button>
</template>

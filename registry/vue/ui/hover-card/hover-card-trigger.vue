<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cn } from "../../lib/utils";
import { hoverCardContextKey } from '../../lib/injection-keys'

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(hoverCardContextKey);
</script>

<template>
  <a v-bind="api.getTriggerProps()" :class="props.class">
    <slot />
  </a>
</template>

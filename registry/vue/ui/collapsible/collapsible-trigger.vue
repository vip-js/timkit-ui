<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { collapsibleContextKey } from '../../lib/injection-keys'

const collapsibleTriggerVariants = cva('')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(collapsibleContextKey);
</script>

<template>
  <button v-bind="api.getTriggerProps()" type="button" :class="cn(collapsibleTriggerVariants(), props.class)">
    <slot />
  </button>
</template>

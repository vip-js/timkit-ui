<script setup lang="ts">
import { computed } from "vue";
import { cn, commandEmptyVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

import { commandMatches } from "./use-command";
import { useCommandContext } from "./use-command-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const context = useCommandContext();
const visible = computed(
  () => !context.options.value.some((item) => commandMatches(item, context.query.value))
);
</script>

<template>
  <div
    v-if="visible"
    data-slot="command-empty"
    role="status"
    :class="cn(commandEmptyVariants(), props.class)"
  >
    <slot />
  </div>
</template>

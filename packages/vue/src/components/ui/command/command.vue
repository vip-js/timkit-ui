<script setup lang="ts">
import { computed, ref } from "vue";
import { commandMatches } from "./use-command";
import { cn, commandVariants } from "@timui/core";
import { useCommand, type UseCommandProps } from "./use-command";
import { provideCommandContext } from "./use-command-context";

const props = defineProps<UseCommandProps>();
const emit = defineEmits<{
  (e: "update:value", value?: string): void;
  (e: "update:modelValue", value?: string): void;
  (e: "change", value?: string): void;
}>();

const { api, disabled, query, options, selected, choose, registerItem, unregisterItem } = useCommand(props, emit);
const itemStatus = computed(() => {
  const visible = options.value.filter((item) => commandMatches(item, query.value));
  if (!selected.value) return "";
  const index = visible.findIndex((item) => item.value === selected.value);
  return index < 0 ? "" : `Item ${index + 1} of ${visible.length}`;
});
provideCommandContext({ api, disabled, query, options, selected, choose, registerItem, unregisterItem });

const rootEl = ref<HTMLElement | null>(null);

defineExpose({
  rootEl,
  api,
});
</script>

<template>
  <p v-if="itemStatus" role="status">{{ itemStatus }}</p>
  <div
    :class="
      cn(
        commandVariants(),
        props.class
      )
    "
    v-bind="api?.getRootProps?.()"
    ref="rootEl"
  >
    <slot />
  </div>
</template>

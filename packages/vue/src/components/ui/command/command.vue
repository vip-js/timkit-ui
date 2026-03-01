<script setup lang="ts">
import { ref } from "vue";
import { cn, commandVariants } from "@timui/core";
import { useCommand, type UseCommandProps } from "./use-command";
import { provideCommandContext } from "./use-command-context";

const props = defineProps<UseCommandProps>();
const emit = defineEmits<{
  (e: "update:value", value?: string): void;
  (e: "update:modelValue", value?: string): void;
  (e: "change", value?: string): void;
}>();

const { api, registerItem, unregisterItem } = useCommand(props, emit);
provideCommandContext({ api, registerItem, unregisterItem });

const rootEl = ref<HTMLElement | null>(null);

defineExpose({
  rootEl,
  api,
});
</script>

<template>
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

<script setup lang="ts">
import { computed, inject, ref } from "vue";
import { SearchIcon } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  onValueChange?: (value: string) => void;
  listId?: string;
  expanded?: boolean;
}>();
const context = inject("command") as any;
const inputProps = computed(() => context?.api.value?.getInputProps?.() || {});
const inputEl = ref<HTMLInputElement | null>(null);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  inputProps.value.onInput?.(event);
  inputProps.value.onChange?.(event);
  props.onValueChange?.(target.value);
};

defineExpose({
  inputEl,
});
</script>

<template>
  <div class="flex items-center border-b px-3" cmdk-input-wrapper>
    <SearchIcon class="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <input
      v-bind="inputProps"
      ref="inputEl"
      :aria-controls="props.listId"
      :aria-expanded="props.expanded"
      :class="
        cn(
          'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          props.class
        )
      "
      @input="onInput"
    />
  </div>
</template>

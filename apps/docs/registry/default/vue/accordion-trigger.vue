<script setup lang="ts">
import { inject, type HTMLAttributes, computed } from "vue";
import { ChevronDownIcon } from "lucide-vue-next";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject("accordion") as any;
const item = inject("accordion-item") as any;

const isOpen = computed(() => item.value?.isOpen ?? false);
const isDisabled = computed(() => item.value?.disabled ?? false);
const triggerProps = computed(() => {
  if (!api?.value) return {};
  return api.value.getItemTriggerProps({ value: item.value?.value, disabled: isDisabled.value });
});
</script>

<template>
  <div class="flex">
    <button
      v-bind="triggerProps"
      data-slot="accordion-trigger"
      :data-state="isOpen ? 'open' : 'closed'"
      type="button"
      :disabled="isDisabled"
      :class="
        cn(
          'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-semibold transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
          props.class
        )
      "
    >
      <slot />
      <slot name="icon">
        <ChevronDownIcon
          :size="16"
          class="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
        />
      </slot>
    </button>
  </div>
</template>

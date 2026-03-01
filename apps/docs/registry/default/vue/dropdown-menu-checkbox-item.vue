<script setup lang="ts">
import { computed, getCurrentInstance, inject, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  checked?: boolean;
  value?: string;
}>();

const emit = defineEmits(["update:checked", "checkedChange"]);
const api = inject("dropdown-menu") as any;
const instance = getCurrentInstance();
const optionValue = computed(() => props.value || `dropdown-checkbox-${instance?.uid ?? 0}`);

const optionProps = computed(() => {
  if (!api.value) return {};
  return api.value.getOptionItemProps({
    type: "checkbox",
    checked: props.checked,
    value: optionValue.value,
    onCheckedChange: (details: any) => {
      emit("update:checked", details.checked);
      emit("checkedChange", details.checked);
    },
  });
});
</script>

<template>
  <div
    v-bind="optionProps"
    data-slot="dropdown-menu-checkbox-item"
    :class="
      cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.class
      )
    "
  >
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <svg
        v-if="props.checked"
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-4 w-4"
      >
        <path d="M3.5 8.5l3 3 6-7" />
      </svg>
    </span>
    <slot />
  </div>
</template>

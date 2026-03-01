<script setup lang="ts">
import { useDropdownMenuContext } from "./use-dropdown-menu-context";
import { computed, getCurrentInstance, inject, type HTMLAttributes, type Ref } from "vue";
import { cn, dropdownMenuCheckboxItemVariants } from "@timui/core";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  checked?: boolean;
  value?: string;
}>();

const emit = defineEmits(["update:checked", "checkedChange"]);

type DropdownCheckedDetails = { checked: boolean };
type BindValue = string | number | boolean | null | undefined | ((value: DropdownCheckedDetails) => void);
type DropdownMenuApi = {
  getOptionItemProps: (options: {
    type: "radio" | "checkbox";
    checked?: boolean;
    value: string;
    onCheckedChange?: (details: DropdownCheckedDetails) => void;
  }) => Record<string, BindValue>;
};

const api = useDropdownMenuContext() as Ref<DropdownMenuApi | undefined> | undefined;
const instance = getCurrentInstance();
const optionValue = computed(() => props.value || `dropdown-checkbox-${instance?.uid ?? 0}`);

const optionProps = computed(() => {
  if (!api?.value) return {};
  return api.value.getOptionItemProps({
    type: "checkbox",
    checked: props.checked,
    value: optionValue.value,
    onCheckedChange: (details: DropdownCheckedDetails) => {
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
        dropdownMenuCheckboxItemVariants(),
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

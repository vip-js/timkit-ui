<script setup lang="ts">
import { useDropdownMenuContext, useDropdownMenuRadioGroupContext } from "./use-dropdown-menu-context";
import { computed, useId, type HTMLAttributes, type Ref } from "vue";
import { cn, dropdownMenuRadioItemVariants } from "@timui/core";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  checked?: boolean;
  value?: string;
  onCheckedChange?: (checked: boolean) => void;
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
const group = useDropdownMenuRadioGroupContext();
const generatedId = useId();
const optionValue = computed(() => props.value ?? generatedId);
const isChecked = computed(() =>
  group ? group.value.value === optionValue.value : !!props.checked
);

const optionProps = computed(() => {
  if (!api?.value) return {};
  return api.value.getOptionItemProps({
    type: "radio",
    checked: isChecked.value,
    value: optionValue.value,
    onCheckedChange: (details: DropdownCheckedDetails) => {
      if (details.checked) {
        group?.value.onValueChange?.(optionValue.value);
      }
      props.onCheckedChange?.(details.checked);
      emit("update:checked", details.checked);
      emit("checkedChange", details.checked);
    },
  });
});
</script>

<template>
  <div
    v-bind="optionProps"
    data-slot="dropdown-menu-radio-item"
    :class="
      cn(
        dropdownMenuRadioItemVariants(),
        props.class
      )
    "
  >
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <svg
        v-if="isChecked"
        aria-hidden="true"
        viewBox="0 0 8 8"
        fill="currentColor"
        class="h-2 w-2"
      >
        <circle cx="4" cy="4" r="3" />
      </svg>
    </span>
    <slot />
  </div>
</template>

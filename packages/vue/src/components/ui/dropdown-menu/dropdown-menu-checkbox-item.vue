<script setup lang="ts">
import { useDropdownMenuContext } from "./use-dropdown-menu-context";
import { computed, inject, ref, useId, type ComputedRef, type HTMLAttributes, type Ref } from "vue";
import { usePassedProp } from "../../../hooks/passed-prop";
import { cn, dropdownMenuCheckboxItemVariants } from "@timui/core";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  checked?: boolean | null;
  value?: string;
  disabled?: boolean;
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
const groupDisabled = inject<ComputedRef<boolean>>("dropdown-menu-disabled", computed(() => false));
const passed = usePassedProp();
const generatedId = useId();
const optionValue = computed(() => props.value ?? generatedId);
const uncontrolled = ref(false);
const current = computed(() => {
  const controlled = passed<boolean>(props, "checked");
  return controlled !== undefined ? controlled : uncontrolled.value;
});

const writeLocal = (next: boolean) => {
  if (passed<boolean | null>(props, "checked") === undefined) uncontrolled.value = next;
};

const notify = (next: boolean) => {
  writeLocal(next);
  emit("update:checked", next);
  emit("checkedChange", next);
};

const choose = () => {
  if (props.disabled || groupDisabled.value) return;
  notify(!current.value);
};

const optionProps = computed(() => {
  if (!api?.value) return {};
  const machine = api.value.getOptionItemProps({
    type: "checkbox",
    checked: current.value,
    value: optionValue.value,
    onCheckedChange: (details: DropdownCheckedDetails) => {
      if (props.disabled || groupDisabled.value || typeof details?.checked !== "boolean") return;
      writeLocal(details.checked);
    },
  });
  const machineClick = machine.onClick as ((event: MouseEvent) => void) | undefined;
  return {
    ...machine,
    onClick: (event: MouseEvent) => {
      if (props.disabled || groupDisabled.value) return;
      machineClick?.(event);
    },
  };
});
</script>

<template>
  <div
    v-bind="optionProps"
    data-slot="dropdown-menu-checkbox-item"
    :data-state="current ? 'checked' : 'unchecked'"
    @click="choose"
    :class="
      cn(
        dropdownMenuCheckboxItemVariants(),
        props.class
      )
    "
  >
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <svg
        v-if="current"
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

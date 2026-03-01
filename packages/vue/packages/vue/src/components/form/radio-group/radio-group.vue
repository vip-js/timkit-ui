<script setup lang="ts">
import { computed, provide, type ComputedRef } from "vue";
import type { AssertNoExtraKeys, RadioGroupVueProps } from "@timui/core";
import { radioGroupConnect, radioGroupMachine } from "@timui/core";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { cn, radioGroupVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";
import type { RadioGroupApi } from "@timui/core";

type RadioGroupProps = RadioGroupVueProps & { class?: HTMLAttributes["class"] };
type _RadioGroupPropsGuard = AssertNoExtraKeys<RadioGroupProps, RadioGroupProps>;

const props = defineProps<RadioGroupProps>();

const emit = defineEmits(["update:modelValue", "change"]);

const machineProps = computed(() => ({
  id: props.id,
  value: props.modelValue ?? props.value,
  defaultValue:
    props.modelValue === undefined && props.value === undefined
      ? props.defaultValue
      : undefined,
  disabled: props.disabled,
  required: props.required,
  name: props.name,
  onValueChange(details: { value: string | null }) {
    emit("update:modelValue", details.value);
    emit("change", details.value);
  },
}));

const service = useMachine(radioGroupMachine, machineProps);
const api = computed(() => radioGroupConnect(service, normalizeProps));

provide<ComputedRef<RadioGroupApi> | null>("radio-group", api);
</script>

<template>
  <div
    v-bind="api?.getRootProps?.()"
    data-slot="radio-group"
    :class="cn(radioGroupVariants(), props.class)"
  >
    <slot />
  </div>
</template>

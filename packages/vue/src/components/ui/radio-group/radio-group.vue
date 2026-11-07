<script setup lang="ts">
import { computed, provide, ref, useAttrs, type ComputedRef } from "vue";
import type { AssertNoExtraKeys, RadioGroupVueProps } from "@timui/core";
import { radioGroupConnect, radioGroupMachine } from "@timui/core";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { cn, radioGroupVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";
import type { RadioGroupApi } from "@timui/core";

import { useRadioGroup } from "./use-radio-group";
import { provideRadioGroupContext } from "./use-radio-group-context";

type RadioGroupProps = RadioGroupVueProps & {
  class?: HTMLAttributes["class"];
  readOnly?: boolean;
  orientation?: "horizontal" | "vertical";
};
type _RadioGroupPropsGuard = AssertNoExtraKeys<RadioGroupProps, RadioGroupProps>;

const props = defineProps<RadioGroupProps>();
const attrs = useAttrs();

const emit = defineEmits(["update:modelValue", "change"]);

const api = useRadioGroup(props, emit);
provideRadioGroupContext(api);
const registered = ref<string[]>([]);
const registerOption = (value: string) => {
  if (registered.value.includes(value)) return;
  registered.value = [...registered.value, value];
};
provide("radio-register", registerOption);
const optionStatus = computed(() => {
  const active = api.value.value;
  const index = active == null || active === "" ? -1 : registered.value.indexOf(String(active));
  return index < 0 ? "" : `Option ${index + 1} of ${registered.value.length}`;
});

const rootProps = computed(() => {
  const root = api.value.getRootProps() as {
    onKeydown?: (event: KeyboardEvent) => void
    onKeyDown?: (event: KeyboardEvent) => void
    [key: string]: unknown
  }
  const { onKeydown, onKeyDown, ...rest } = root;
  const previous = onKeydown ?? onKeyDown;
  return {
    ...rest,
    onKeydown(event: KeyboardEvent) {
      if (typeof previous === "function") previous(event);
      if (event.defaultPrevented || props.disabled || props.readOnly) return;
      if (!/^[a-z]$/i.test(event.key)) return;
      const letter = event.key.toLowerCase();
      const group = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
      const items = [...(group?.querySelectorAll<HTMLElement>('[data-slot="radio-group-item"]') ?? [])].filter(
        (item) => item.getAttribute("data-disabled") == null && item.getAttribute("aria-disabled") !== "true"
      );
      const current = items.findIndex((item) => item.getAttribute("data-state") === "checked");
      for (let step = 1; step <= items.length; step += 1) {
        const next = items[(current + step) % items.length];
        const name = (next?.textContent ?? "").replace(/\s+/g, " ").trim();
        if (!name.toLowerCase().startsWith(letter)) continue;
        const nextValue = next.querySelector("input")?.getAttribute("value");
        if (!nextValue) return;
        event.preventDefault();
        api.value.setValue(nextValue);
        return;
      }
    },
  };
});
</script>

<template>
  <p v-if="optionStatus" role="status">{{ optionStatus }}</p>
  <div
    v-bind="rootProps"
    :aria-label="attrs['aria-label'] || 'Radio group'"
    data-slot="radio-group"
    :class="cn(radioGroupVariants(), props.class)"
  >
    <slot />
  </div>
</template>

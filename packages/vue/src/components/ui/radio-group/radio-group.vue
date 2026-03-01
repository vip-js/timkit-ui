<script setup lang="ts">
import { computed, provide, type ComputedRef } from "vue";
import type { AssertNoExtraKeys, RadioGroupVueProps } from "@timui/core";
import { radioGroupConnect, radioGroupMachine } from "@timui/core";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { cn, radioGroupVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";
import type { RadioGroupApi } from "@timui/core";

import { useRadioGroup } from "./use-radio-group";
import { provideRadioGroupContext } from "./use-radio-group-context";

type RadioGroupProps = RadioGroupVueProps & { class?: HTMLAttributes["class"] };
type _RadioGroupPropsGuard = AssertNoExtraKeys<RadioGroupProps, RadioGroupProps>;

const props = defineProps<RadioGroupProps>();

const emit = defineEmits(["update:modelValue", "change"]);

const api = useRadioGroup(props, emit);
provideRadioGroupContext(api);
</script>

<template>
  <div
    v-bind="api.getRootProps()"
    data-slot="radio-group"
    :class="cn(radioGroupVariants(), props.class)"
  >
    <slot />
  </div>
</template>

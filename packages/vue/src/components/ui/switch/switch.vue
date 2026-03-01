<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { normalizeProps, useMachine } from '@zag-js/vue'
import type { AssertNoExtraKeys, SwitchVueProps } from '@timui/core'
import { switchConnect, switchMachine } from '@timui/core'
import { cn, switchRootVariants, switchThumbVariants, switchVariants } from '@timui/core'

import { useSwitch } from './use-switch'

type SwitchProps = SwitchVueProps & { class?: HTMLAttributes['class'] }
type _SwitchPropsGuard = AssertNoExtraKeys<SwitchProps, SwitchProps>

const props = defineProps<SwitchProps>()

const emit = defineEmits(['update:modelValue', 'change'])

const api = useSwitch(props, emit)
const rootProps = computed(() => api.value?.getRootProps?.() ?? {})
const controlProps = computed(() => api.value?.getControlProps?.() ?? {})
const thumbProps = computed(() => api.value?.getThumbProps?.() ?? {})
const hiddenInputProps = computed(() => api.value?.getHiddenInputProps?.() ?? {})
</script>

<template>
  <label
    v-bind="rootProps"
    data-slot="switch-root"
    :class="cn(switchRootVariants(), rootProps.class)"
  >
    <button
      v-bind="controlProps"
      type="button"
      data-slot="switch"
      :class="cn(switchVariants(), controlProps.class, props.class)"
    >
      <span
        v-bind="thumbProps"
        data-slot="switch-thumb"
        :class="cn(switchThumbVariants(), thumbProps.class)"
      />
    </button>
    <input v-bind="hiddenInputProps" />
  </label>
</template>

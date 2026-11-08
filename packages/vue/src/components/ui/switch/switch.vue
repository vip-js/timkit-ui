<script setup lang="ts">
import { computed, useAttrs, type HTMLAttributes } from 'vue'
import { normalizeProps, useMachine } from '@zag-js/vue'
import type { AssertNoExtraKeys, SwitchVueProps } from '@timui/core'
import { switchConnect, switchMachine } from '@timui/core'
import { cn, switchRootVariants, switchThumbVariants, switchVariants } from '@timui/core'

import { useSwitch } from './use-switch'

type SwitchProps = SwitchVueProps & { class?: HTMLAttributes['class']; readOnly?: boolean }
type _SwitchPropsGuard = AssertNoExtraKeys<SwitchProps, SwitchProps>

defineOptions({ inheritAttrs: false })

const props = defineProps<SwitchProps>()
const attrs = useAttrs()
const attrValue = (name: string) => {
  const value = attrs[name]
  return typeof value === 'string' ? value : undefined
}

const emit = defineEmits(['update:modelValue', 'change'])

const api = useSwitch(props, emit)
const rootProps = computed(() => api.value?.getRootProps?.() ?? {})
const controlProps = computed(() => api.value?.getControlProps?.() ?? {})
const thumbProps = computed(() => api.value?.getThumbProps?.() ?? {})
const hiddenInputProps = computed(() => api.value?.getHiddenInputProps?.() ?? {})
const checkStatus = computed(() => (api.value?.checked ? 'On' : ''))
const onPress = (event?: Event) => {
  if (api.value?.disabled || props.readOnly) {
    event?.preventDefault()
    return
  }
  api.value?.setChecked(!api.value.checked)
}
</script>

<template>
  <p v-if="checkStatus" role="status">{{ checkStatus }}</p>
  <label
    v-bind="rootProps"
    data-slot="switch-root"
    :class="cn(switchRootVariants(), rootProps.class)"
  >
    <button
      v-bind="controlProps"
      type="button"
      data-slot="switch"
      :aria-label="undefined"
      :aria-invalid="attrValue('aria-invalid') === 'true' ? 'true' : undefined"
      :aria-describedby="attrValue('aria-describedby')"
      :class="cn(switchVariants(), controlProps.class, props.class)"
      @click="onPress"
    >
      <span
        v-bind="thumbProps"
        data-slot="switch-thumb"
        :class="cn(switchThumbVariants(), thumbProps.class)"
      />
    </button>
    <input
      v-bind="hiddenInputProps"
      :aria-label="attrValue('aria-label') || 'Switch'"
      :aria-labelledby="undefined"
      @keydown.space.prevent
      @keyup.space.prevent="onPress"
    />
  </label>
</template>

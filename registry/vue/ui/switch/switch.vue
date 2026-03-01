<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { normalizeProps, useMachine } from '@zag-js/vue'
import * as zagSwitch from '@zag-js/switch'
import { cva } from '../../lib/cva'
import { cn } from '../../lib/utils'

const switchRootVariants = cva('inline-flex items-center')
const switchVariants = cva(
    'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input'
)
const switchThumbVariants = cva(
    'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
)

type SwitchProps = {
  modelValue?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  id?: string;
  class?: HTMLAttributes['class'];
}

const props = defineProps<SwitchProps>()

const emit = defineEmits(['update:modelValue', 'change'])

const machineProps = computed(() => ({
  id: props.id,
  checked: props.modelValue ?? props.checked,
  defaultChecked:
    props.modelValue === undefined && props.checked === undefined
      ? props.defaultChecked
      : undefined,
  disabled: props.disabled,
  required: props.required,
  name: props.name,
  value: props.value ?? 'on',
  onCheckedChange(details: { checked: boolean }) {
    emit('update:modelValue', details.checked)
    emit('change', details.checked)
  },
}))

const service = useMachine(zagSwitch.machine, machineProps)
const api = computed(() => zagSwitch.connect(service, normalizeProps))
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

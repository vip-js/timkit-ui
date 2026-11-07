<script setup lang="ts">
import { type HTMLAttributes, computed, ref, useAttrs, useId, watchEffect } from 'vue'
import type { AssertNoExtraKeys, InputVueProps, TextInputValueChangeEvent } from '@timui/core'
import { cn, inputVariants, createTimEvent } from '@timui/core'

defineOptions({
  inheritAttrs: false,
})

type InputProps = InputVueProps & { class?: HTMLAttributes['class']; maxLength?: number }
type _InputPropsGuard = AssertNoExtraKeys<
  InputProps,
  InputVueProps & { class?: HTMLAttributes['class']; maxLength?: number }
>

const props = defineProps<InputProps>()
const attrs = useAttrs()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'valueChange', event: TextInputValueChangeEvent): void
}>()

const modelValue = defineModel<string | number>({ required: false })
const uncontrolled = ref(props.defaultValue ?? '')
const current = computed(() => {
  if (modelValue.value !== undefined) return modelValue.value == null ? '' : String(modelValue.value)
  if (props.value !== undefined) return props.value == null ? '' : String(props.value)
  return String(uncontrolled.value ?? '')
})
const fieldType = computed(() => {
  const type = props.type ?? attrs.type
  return typeof type === 'string' ? type : undefined
})
const inputType = computed(() => {
  if (fieldType.value === 'search') return 'search'
  if (fieldType.value === 'file') return 'file'
  return 'default'
})

const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const field = ref<HTMLInputElement | null>(null)
const revealed = ref(false)
const revealable = computed(() => fieldType.value === 'password' && props.disabled !== true)
const reveal = () => {
  if (!revealable.value) return
  revealed.value = !revealed.value
  field.value?.focus()
}
const clearable = computed(
  () => fieldType.value !== 'file' && props.disabled !== true && props.readOnly !== true && current.value !== ''
)
const clear = () => {
  if (!clearable.value) return
  if (props.value === undefined) {
    uncontrolled.value = ''
    if (modelValue.value !== undefined) modelValue.value = ''
  }
  emit('valueChange', createTimEvent('change', inputId.value, { value: '' }))
  field.value?.focus()
}

const limit = computed(() =>
  typeof props.maxLength === 'number' && props.maxLength >= 0 ? props.maxLength : undefined
)
const counted = computed(() => limit.value !== undefined && fieldType.value !== 'file')
const described = computed(() => {
  const passed = attrs['aria-describedby']
  const countId = counted.value ? `${inputId.value}-count` : ''
  const ids = [typeof passed === 'string' ? passed : '', countId].filter(Boolean)
  return ids.length ? ids.join(' ') : undefined
})
const cut = (text: string) => {
  const max = limit.value
  return max === undefined || text.length <= max ? text : text.slice(0, max)
}
const limitedMark = ref('')
watchEffect(() => {
  const max = limit.value
  if (max === undefined) return
  const text = String(current.value ?? '')
  if (text.length <= max) return
  const next = text.slice(0, max)
  const mark = `${max}:${next}:${text}`
  if (limitedMark.value === mark) return
  limitedMark.value = mark
  if (modelValue.value === undefined && props.value === undefined) uncontrolled.value = next
  emit('valueChange', createTimEvent('change', inputId.value, { value: next }))
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (props.disabled || props.readOnly) {
    target.value = current.value
    return
  }
  const next = cut(target.value)
  if (next !== target.value) target.value = next
  if (next === current.value) return
  if (modelValue.value === undefined && props.value === undefined) {
    uncontrolled.value = next
    modelValue.value = next
  } else {
    target.value = current.value
  }
  const change = createTimEvent('change', inputId.value, { value: next })
  emit('valueChange', change)
}
</script>

<template>
  <span>
  <input
    ref="field"
    data-slot="input"
    :id="inputId"
    :class="
      cn(
        inputVariants({ type: inputType }),
        props.class,
      )
    "
    v-bind="attrs"
    :type="fieldType === 'password' && revealed ? 'text' : fieldType"
    :value="current"
    :disabled="props.disabled"
    :required="props.required || undefined"
    :aria-required="props.required ? 'true' : undefined"
    :maxlength="limit"
    :aria-describedby="described"
    :readonly="props.readOnly"
    @input="handleChange"
  />
  <button v-if="clearable" type="button" aria-label="Clear" @click="clear">Clear</button>
  <button v-if="revealable" type="button" :aria-label="revealed ? 'Hide password' : 'Show password'" @click="reveal">
    {{ revealed ? 'Hide password' : 'Show password' }}
  </button>
  <p v-if="counted" :id="`${inputId}-count`" role="status">{{ `${current.length} of ${limit}` }}</p>
  <p v-if="fieldType === 'password' && revealed" role="status">Visible</p>
  </span>
</template>

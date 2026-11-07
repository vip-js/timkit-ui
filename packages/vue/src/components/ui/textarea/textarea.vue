<script setup lang="ts">
import type { AssertNoExtraKeys, TextareaVueProps, TextInputValueChangeEvent } from "@timui/core";
import { cn, textareaVariants, createTimEvent } from "@timui/core";
import { computed, ref, useAttrs, type HTMLAttributes, useId, watchEffect } from "vue";

type TextareaProps = TextareaVueProps & { class?: HTMLAttributes["class"] };
type _TextareaPropsGuard = AssertNoExtraKeys<
  TextareaProps,
  TextareaVueProps & { class?: HTMLAttributes["class"] }
>;

defineOptions({ inheritAttrs: false });

const props = defineProps<TextareaProps>();
const attrs = useAttrs();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
  (e: "valueChange", event: TextInputValueChangeEvent): void;
}>();

const uncontrolled = ref(props.defaultValue ?? "")
const current = computed(() => {
  if (props.modelValue !== undefined) return props.modelValue == null ? "" : String(props.modelValue)
  if (props.value !== undefined) return props.value == null ? "" : String(props.value)
  return String(uncontrolled.value ?? "")
})

const generatedId = useId()
const textareaId = computed(() => props.id ?? generatedId)
const described = computed(() => {
  const passed = attrs["aria-describedby"]
  const countId = limit.value !== undefined ? `${textareaId.value}-count` : ""
  const ids = [typeof passed === "string" ? passed : "", countId].filter(Boolean)
  return ids.length ? ids.join(" ") : undefined
})
const field = ref<HTMLTextAreaElement | null>(null)
const clearable = computed(() => props.disabled !== true && props.readOnly !== true && current.value !== "")
const clear = () => {
  if (!clearable.value) return
  if (props.value === undefined && props.modelValue === undefined) uncontrolled.value = ""
  emits("update:modelValue", "")
  emits("valueChange", createTimEvent("change", textareaId.value, { value: "" }))
  field.value?.focus()
}

const limit = computed(() =>
  typeof props.maxLength === "number" && props.maxLength >= 0 ? props.maxLength : undefined
)
const cut = (text: string) => {
  const max = limit.value
  return max === undefined || text.length <= max ? text : text.slice(0, max)
}
const limitedMark = ref("")
watchEffect(() => {
  const max = limit.value
  if (max === undefined) return
  const text = String(current.value ?? "")
  if (text.length <= max) return
  const next = text.slice(0, max)
  const mark = `${max}:${next}:${text}`
  if (limitedMark.value === mark) return
  limitedMark.value = mark
  if (props.value === undefined && props.modelValue === undefined) uncontrolled.value = next
  emits("valueChange", createTimEvent("change", textareaId.value, { value: next }))
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  if (props.disabled || props.readOnly) {
    target.value = current.value
    return
  }
  const next = cut(target.value)
  if (next !== target.value) target.value = next
  if (next === current.value) return
  if (props.value === undefined && props.modelValue === undefined) uncontrolled.value = next
  else target.value = current.value
  emits("update:modelValue", next)
  const change = createTimEvent("change", textareaId.value, { value: next })
  emits("valueChange", change)
}
</script>

<template>
  <span>
  <textarea
    ref="field"
    v-bind="attrs"
    data-slot="textarea"
    :id="textareaId"
    :class="cn(textareaVariants(), props.class)"
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
  <p v-if="limit !== undefined" :id="`${textareaId}-count`" role="status">{{ `${current.length} of ${limit}` }}</p>
  </span>
</template>

<script lang="ts">
import { defineComponent, h, reactive, watchEffect } from 'vue'
import type { PropType } from 'vue'
import type { AssertNoExtraKeys, DateFieldVueProps } from '@timui/core'
import { cn, dateFieldInputVariants, dateFieldSegmentVariants } from '@timui/core'
import { DateFieldProvider, useDateFieldContext } from './use-date-field-context'

type DateInputProps = DateFieldVueProps & { class?: string }
type _DateInputPropsGuard = AssertNoExtraKeys<
  DateInputProps,
  DateFieldVueProps & { class?: string }
>

export const dateInputStyle = dateFieldInputVariants()

export const DateField = defineComponent({
  name: 'DateField',
  inheritAttrs: false,
  props: {
    class: {
      type: String,
      default: undefined,
    },
    type: {
      type: String as () => 'date' | 'time' | 'datetime-local',
      default: undefined,
    },
    granularity: {
      type: String as () => 'day' | 'minute' | 'second',
      default: undefined,
    },
    hourCycle: {
      type: Number as () => 12 | 24,
      default: undefined,
    },
    value: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    readOnly: { type: Boolean, default: false },
    min: { type: String, default: '' },
    max: { type: String, default: '' },
    onValueChange: { type: Function as unknown as () => ((value: string) => void) | undefined, default: undefined },
  },
  setup(props, { attrs, slots }) {
    const inputType = props.type ?? (props.granularity && props.granularity !== 'day' ? 'datetime-local' : 'date')
    const field = reactive({
      inputType,
      granularity: props.granularity,
      hourCycle: props.hourCycle,
      value: props.value,
      disabled: props.disabled,
      readOnly: props.readOnly,
      min: props.min,
      max: props.max,
      onValueChange: props.onValueChange,
    })
    watchEffect(() => {
      field.inputType = props.type ?? (props.granularity && props.granularity !== 'day' ? 'datetime-local' : 'date')
      field.granularity = props.granularity
      field.hourCycle = props.hourCycle
      field.value = props.value
      field.disabled = props.disabled
      field.readOnly = props.readOnly
      field.min = props.min
      field.max = props.max
      field.onValueChange = props.onValueChange
    })
    DateFieldProvider(field)
    return () => {
      const raw = typeof field.value === 'string' ? field.value : ''
      const dayStatus = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : ''
      return h(
        'div',
        {
          ...attrs,
          class: cn(props.class),
        },
        [dayStatus ? h('p', { role: 'status' }, dayStatus) : null, slots.default?.()]
      )
    }
  },
})

export const TimeField = defineComponent({
  name: 'TimeField',
  inheritAttrs: false,
  props: {
    class: {
      type: String,
      default: undefined,
    },
    type: {
      type: String as () => 'date' | 'time' | 'datetime-local',
      default: undefined,
    },
    granularity: {
      type: String as () => 'day' | 'minute' | 'second',
      default: undefined,
    },
    hourCycle: {
      type: Number as () => 12 | 24,
      default: undefined,
    },
  },
  setup(props, { attrs, slots }) {
    DateFieldProvider({
      inputType: props.type ?? 'time',
      granularity: props.granularity,
      hourCycle: props.hourCycle,
    })
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: cn(props.class),
        },
        slots.default?.()
      )
  },
})

export const DateSegment = defineComponent({
  name: 'DateSegment',
  inheritAttrs: false,
  props: {
    class: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'span',
        {
          ...attrs,
          class: cn(dateFieldSegmentVariants(), props.class),
        },
        slots.default?.()
      )
  },
})

export const DateInput = defineComponent({
  name: 'DateInput',
  inheritAttrs: false,
  props: {
    modelValue: { type: String as PropType<string | null>, default: undefined },
    type: { type: String as () => 'date' | 'time' | 'datetime-local', default: undefined },
    unstyled: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
    class: { type: String, default: undefined },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { attrs, emit }) {
    const context = useDateFieldContext()

    const dayStamp = (raw?: string) => {
      const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw || '')
      if (!match) return undefined
      return Number(match[1]) * 10000 + Number(match[2]) * 100 + Number(match[3])
    }
    const outsideRange = (value: string) => {
      const day = dayStamp(value)
      if (day == null) return false
      const low = dayStamp(context?.min)
      const high = dayStamp(context?.max)
      return (low != null && day < low) || (high != null && day > high)
    }
    const onInput = (event: Event) => {
      const target = event.target as HTMLInputElement
      if (context?.disabled || context?.readOnly || outsideRange(target.value)) {
        target.value = (props.modelValue !== undefined ? props.modelValue : context?.value) ?? ''
        return
      }
      const next = target.value
      if (props.modelValue !== undefined) target.value = props.modelValue ?? ''
      context?.onValueChange?.(next)
      emit('update:modelValue', next)
      emit('change', next)
    }

    return () => {
      const stepFromAttrs = attrs.step as number | string | undefined
      const resolvedType = props.type ?? context?.inputType ?? 'date'
      const resolvedStep =
        stepFromAttrs ??
        (context?.granularity === 'second' ? 1 : context?.granularity === 'minute' ? 60 : undefined)

      return h('input', {
        ...attrs,
        type: resolvedType,
        step: resolvedStep,
        value: props.modelValue !== undefined ? (props.modelValue ?? '') : context?.value,
        min: context?.min || undefined,
        max: context?.max || undefined,
        disabled: context?.disabled || undefined,
        readOnly: context?.readOnly || undefined,
        'aria-readonly': context?.readOnly ? 'true' : undefined,
        class: cn(!props.unstyled && dateFieldInputVariants(), props.class),
        'aria-invalid': props.invalid || undefined,
        onInput,
      })
    }
  },
})

export default DateField
</script>

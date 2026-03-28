<script lang="ts">
import { defineComponent, h } from 'vue'
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
  },
  setup(props, { attrs, slots }) {
    const inputType = props.type ?? (props.granularity && props.granularity !== 'day' ? 'datetime-local' : 'date')
    DateFieldProvider({
      inputType,
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
    modelValue: { type: String, default: undefined },
    type: { type: String as () => 'date' | 'time' | 'datetime-local', default: undefined },
    unstyled: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
    class: { type: String, default: undefined },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { attrs, emit }) {
    const context = useDateFieldContext()

    const onInput = (event: Event) => {
      const target = event.target as HTMLInputElement
      emit('update:modelValue', target.value)
      emit('change', target.value)
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
        value: props.modelValue,
        class: cn(!props.unstyled && dateFieldInputVariants(), props.class),
        'aria-invalid': props.invalid || undefined,
        onInput,
      })
    }
  },
})

export default DateField
</script>

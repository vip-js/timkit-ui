<script lang="ts">
import { defineComponent, h, type PropType } from 'vue'
import Calendar from './calendar.vue'

type CalendarModelValue = Date | { from?: Date; to?: Date } | undefined

export const CalendarRAC = defineComponent({
  name: 'CalendarRAC',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [Date, Object] as PropType<Date | Record<string, never>>,
      default: undefined,
    },
    class: {
      type: String,
      default: undefined,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { attrs, emit }) {
    return () =>
      h(Calendar, {
        ...attrs,
        class: props.class,
        mode: 'single',
        modelValue: props.modelValue,
        'onUpdate:modelValue': (value: CalendarModelValue) => emit('update:modelValue', value),
        onChange: (value: CalendarModelValue) => emit('change', value),
      })
  },
})

export const RangeCalendar = defineComponent({
  name: 'RangeCalendar',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Object as PropType<{ from?: Date; to?: Date }>,
      default: undefined,
    },
    class: {
      type: String,
      default: undefined,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { attrs, emit }) {
    return () =>
      h(Calendar, {
        ...attrs,
        class: props.class,
        mode: 'range',
        modelValue: props.modelValue,
        'onUpdate:modelValue': (value: CalendarModelValue) =>
          emit('update:modelValue', value),
        onChange: (value: CalendarModelValue) => emit('change', value),
      })
  },
})

export default CalendarRAC
</script>

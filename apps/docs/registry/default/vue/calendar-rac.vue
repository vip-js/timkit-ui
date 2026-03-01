<script lang="ts">
import { defineComponent, h } from "vue";
import Calendar from "./calendar.vue";

export const CalendarRAC = defineComponent({
  name: "CalendarRAC",
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [Date, Object] as unknown as () => Date,
      default: undefined,
    },
    class: {
      type: String,
      default: undefined,
    },
  },
  emits: ["update:modelValue", "change"],
  setup(props, { attrs, emit }) {
    return () =>
      h(Calendar, {
        ...attrs,
        class: props.class,
        mode: "single",
        modelValue: props.modelValue,
        "onUpdate:modelValue": (value: Date) => emit("update:modelValue", value),
        onChange: (value: Date) => emit("change", value),
      });
  },
});

export const RangeCalendar = defineComponent({
  name: "RangeCalendar",
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Object as () => { from?: Date; to?: Date },
      default: undefined,
    },
    class: {
      type: String,
      default: undefined,
    },
  },
  emits: ["update:modelValue", "change"],
  setup(props, { attrs, emit }) {
    return () =>
      h(Calendar, {
        ...attrs,
        class: props.class,
        mode: "range",
        modelValue: props.modelValue,
        "onUpdate:modelValue": (value: { from?: Date; to?: Date }) =>
          emit("update:modelValue", value),
        onChange: (value: { from?: Date; to?: Date }) => emit("change", value),
      });
  },
});

export default CalendarRAC;
</script>

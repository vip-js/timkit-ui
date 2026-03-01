<script lang="ts">
import { defineComponent, h } from "vue";
import type { AssertNoExtraKeys, DateFieldVueProps } from "@timui/core";
import { cn, dateFieldInputVariants, dateFieldSegmentVariants } from "@timui/core";

type DateInputProps = DateFieldVueProps & { class?: string };
type _DateInputPropsGuard = AssertNoExtraKeys<
  DateInputProps,
  DateFieldVueProps & { class?: string }
>;

export const dateInputStyle = dateFieldInputVariants();

export const DateField = defineComponent({
  name: "DateField",
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
        "div",
        {
          ...attrs,
          class: cn(props.class),
        },
        slots.default?.()
      );
  },
});

export const TimeField = defineComponent({
  name: "TimeField",
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
        "div",
        {
          ...attrs,
          class: cn(props.class),
        },
        slots.default?.()
      );
  },
});

export const DateSegment = defineComponent({
  name: "DateSegment",
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
        "span",
        {
          ...attrs,
          class: cn(
            dateFieldSegmentVariants(),
            props.class
          ),
        },
        slots.default?.()
      );
  },
});

export const DateInput = defineComponent({
  name: "DateInput",
  inheritAttrs: false,
  props: {
    modelValue: { type: String, default: undefined },
    type: { type: String as () => "date" | "time", default: "date" },
    unstyled: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
    class: { type: String, default: undefined },
  },
  emits: ["update:modelValue", "change"],
  setup(props, { attrs, emit }) {
    const onInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      emit("update:modelValue", target.value);
      emit("change", target.value);
    };

    return () =>
      h("input", {
        ...attrs,
        type: props.type,
        value: props.modelValue,
        class: cn(!props.unstyled && dateFieldInputVariants(), props.class),
        "aria-invalid": props.invalid || undefined,
        onInput,
      });
  },
});

export default DateField;
</script>

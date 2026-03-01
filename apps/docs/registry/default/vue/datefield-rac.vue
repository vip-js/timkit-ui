<script lang="ts">
import { defineComponent, h } from "vue";
import { cn } from "@/lib/utils";

export const dateInputStyle =
  "relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:ring-[3px] data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive";

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
            "text-foreground data-focused:bg-accent data-invalid:data-focused:bg-destructive data-focused:data-placeholder:text-foreground data-focused:text-foreground data-invalid:data-placeholder:text-destructive data-invalid:text-destructive data-placeholder:text-muted-foreground/70 inline rounded p-0.5 caret-transparent outline-hidden data-disabled:cursor-not-allowed data-disabled:opacity-50 data-invalid:data-focused:text-white data-invalid:data-focused:data-placeholder:text-white data-[type=literal]:px-0",
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
    modelValue: {
      type: String,
      default: undefined,
    },
    type: {
      type: String as () => "date" | "time",
      default: "date",
    },
    unstyled: {
      type: Boolean,
      default: false,
    },
    invalid: {
      type: Boolean,
      default: false,
    },
    class: {
      type: String,
      default: undefined,
    },
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
        class: cn(!props.unstyled && dateInputStyle, props.class),
        "aria-invalid": props.invalid || undefined,
        onInput,
      });
  },
});

export default DateField;
</script>

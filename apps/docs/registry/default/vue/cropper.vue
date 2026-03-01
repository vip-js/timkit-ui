<script lang="ts">
import { defineComponent, h } from "vue";
import { cn } from "@/lib/utils";

export const Cropper = defineComponent({
  name: "Cropper",
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
          "data-slot": "cropper",
          class: cn(
            "relative flex w-full cursor-move touch-none items-center justify-center overflow-hidden focus:outline-none",
            props.class
          ),
        },
        slots.default?.()
      );
  },
});

export const CropperDescription = defineComponent({
  name: "CropperDescription",
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
        "p",
        {
          ...attrs,
          "data-slot": "cropper-description",
          class: cn("sr-only", props.class),
        },
        slots.default?.()
      );
  },
});

export const CropperImage = defineComponent({
  name: "CropperImage",
  inheritAttrs: false,
  props: {
    class: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { attrs }) {
    return () =>
      h("img", {
        ...attrs,
        "data-slot": "cropper-image",
        class: cn("pointer-events-none h-full w-full object-cover", props.class),
      });
  },
});

export const CropperCropArea = defineComponent({
  name: "CropperCropArea",
  inheritAttrs: false,
  props: {
    class: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { attrs }) {
    return () =>
      h("div", {
        ...attrs,
        "data-slot": "cropper-crop-area",
        class: cn(
          "pointer-events-none absolute border-3 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.3)] in-[[data-slot=cropper]:focus-visible]:ring-[3px] in-[[data-slot=cropper]:focus-visible]:ring-white/50",
          props.class
        ),
      });
  },
});

export default Cropper;
</script>

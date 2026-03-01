<script lang="ts">
import { defineComponent, h } from "vue";
import { cn, cropperCropAreaVariants, cropperDescriptionVariants, cropperImageVariants, cropperRootVariants } from "@timui/core";

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
          class: cn(cropperRootVariants(), props.class),
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
          class: cn(cropperDescriptionVariants(), props.class),
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
        class: cn(cropperImageVariants(), props.class),
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
        class: cn(cropperCropAreaVariants(), props.class),
      });
  },
});

export default Cropper;
</script>

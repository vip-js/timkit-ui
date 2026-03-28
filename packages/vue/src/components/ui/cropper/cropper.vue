<script lang="ts">
import { cn, cropperCropAreaVariants, cropperDescriptionVariants, cropperImageVariants, cropperRootVariants } from "@timui/core";
import {
  computed,
  defineComponent,
  h,
  inject,
  mergeProps,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  watch,
  type ComputedRef,
  type CSSProperties,
  type PropType,
} from "vue";

type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CropperContextValue = {
  image: ComputedRef<string | undefined>;
  imageStyle: ComputedRef<CSSProperties>;
  cropAreaStyle: ComputedRef<CSSProperties>;
  setNaturalSize: (width: number, height: number) => void;
};

const cropperContextKey = Symbol("timui.cropper");

const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

export const Cropper = defineComponent({
  name: "Cropper",
  inheritAttrs: false,
  emits: ["cropChange", "zoomChange"],
  props: {
    class: {
      type: String,
      default: undefined,
    },
    image: {
      type: String,
      default: undefined,
    },
    zoom: {
      type: Number,
      default: undefined,
    },
    minZoom: {
      type: Number,
      default: 1,
    },
    maxZoom: {
      type: Number,
      default: 3,
    },
    aspectRatio: {
      type: Number,
      default: undefined,
    },
    cropPadding: {
      type: Number,
      default: 16,
    },
    onCropChange: {
      type: Function as PropType<(area: CropArea | null) => void>,
      default: undefined,
    },
    onZoomChange: {
      type: Function as PropType<(zoom: number) => void>,
      default: undefined,
    },
  },
  setup(props, { attrs, slots, emit }) {
    const rootRef = ref<HTMLElement | null>(null);
    const containerWidth = ref(0);
    const containerHeight = ref(0);
    const naturalWidth = ref(0);
    const naturalHeight = ref(0);
    const offsetX = ref(0);
    const offsetY = ref(0);
    const internalZoom = ref(props.zoom ?? 1);

    let resizeObserver: ResizeObserver | null = null;
    let dragging = false;
    let activePointerId: number | null = null;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragOriginX = 0;
    let dragOriginY = 0;

    const normalizedMinZoom = computed(() => {
      const min = Number.isFinite(props.minZoom) ? Math.max(props.minZoom, 0.1) : 1;
      const max = Number.isFinite(props.maxZoom) ? Math.max(props.maxZoom, 0.1) : 3;
      return Math.min(min, max);
    });

    const normalizedMaxZoom = computed(() => {
      const min = Number.isFinite(props.minZoom) ? Math.max(props.minZoom, 0.1) : 1;
      const max = Number.isFinite(props.maxZoom) ? Math.max(props.maxZoom, 0.1) : 3;
      return Math.max(min, max);
    });

    const currentZoom = computed(() => {
      const value = typeof props.zoom === "number" ? props.zoom : internalZoom.value;
      return clamp(value, normalizedMinZoom.value, normalizedMaxZoom.value);
    });

    const cropPadding = computed(() => Math.max(props.cropPadding, 0));

    const cropAreaWidth = computed(() => {
      const availableWidth = Math.max(containerWidth.value - cropPadding.value * 2, 0);
      const availableHeight = Math.max(containerHeight.value - cropPadding.value * 2, 0);
      const ratio = props.aspectRatio;

      if (!ratio || ratio <= 0) return availableWidth;
      if (availableHeight <= 0) return 0;

      const byWidth = availableWidth;
      const byHeight = availableHeight * ratio;
      return Math.min(byWidth, byHeight);
    });

    const cropAreaHeight = computed(() => {
      const availableWidth = Math.max(containerWidth.value - cropPadding.value * 2, 0);
      const availableHeight = Math.max(containerHeight.value - cropPadding.value * 2, 0);
      const ratio = props.aspectRatio;

      if (!ratio || ratio <= 0) return availableHeight;
      if (availableWidth <= 0) return 0;

      const byWidth = availableWidth / ratio;
      const byHeight = availableHeight;
      return Math.min(byWidth, byHeight);
    });

    const baseScale = computed(() => {
      if (
        naturalWidth.value <= 0 ||
        naturalHeight.value <= 0 ||
        cropAreaWidth.value <= 0 ||
        cropAreaHeight.value <= 0
      ) {
        return 1;
      }

      const widthScale = cropAreaWidth.value / naturalWidth.value;
      const heightScale = cropAreaHeight.value / naturalHeight.value;
      return Math.max(widthScale, heightScale);
    });

    const appliedScale = computed(() => baseScale.value * currentZoom.value);
    const imageWidth = computed(() => naturalWidth.value * appliedScale.value);
    const imageHeight = computed(() => naturalHeight.value * appliedScale.value);

    const maxOffsetX = computed(() => Math.max((imageWidth.value - cropAreaWidth.value) / 2, 0));
    const maxOffsetY = computed(() => Math.max((imageHeight.value - cropAreaHeight.value) / 2, 0));

    const clampOffsets = () => {
      offsetX.value = clamp(offsetX.value, -maxOffsetX.value, maxOffsetX.value);
      offsetY.value = clamp(offsetY.value, -maxOffsetY.value, maxOffsetY.value);
    };

    const setZoom = (nextZoom: number) => {
      const clampedZoom = clamp(nextZoom, normalizedMinZoom.value, normalizedMaxZoom.value);
      if (typeof props.zoom !== "number") {
        internalZoom.value = clampedZoom;
      }
      props.onZoomChange?.(clampedZoom);
      emit("zoomChange", clampedZoom);
      clampOffsets();
    };

    const getCropArea = (): CropArea | null => {
      if (
        naturalWidth.value <= 0 ||
        naturalHeight.value <= 0 ||
        cropAreaWidth.value <= 0 ||
        cropAreaHeight.value <= 0 ||
        appliedScale.value <= 0
      ) {
        return null;
      }

      const sourceWidth = cropAreaWidth.value / appliedScale.value;
      const sourceHeight = cropAreaHeight.value / appliedScale.value;

      const unclampedX = ((imageWidth.value - cropAreaWidth.value) / 2 - offsetX.value) / appliedScale.value;
      const unclampedY = ((imageHeight.value - cropAreaHeight.value) / 2 - offsetY.value) / appliedScale.value;

      const maxX = Math.max(naturalWidth.value - sourceWidth, 0);
      const maxY = Math.max(naturalHeight.value - sourceHeight, 0);

      const x = clamp(unclampedX, 0, maxX);
      const y = clamp(unclampedY, 0, maxY);

      return {
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(sourceWidth),
        height: Math.round(sourceHeight),
      };
    };

    const emitCropArea = () => {
      const area = getCropArea();
      props.onCropChange?.(area);
      emit("cropChange", area);
    };

    const updateContainerSize = () => {
      const node = rootRef.value;
      if (!node) return;
      containerWidth.value = node.clientWidth;
      containerHeight.value = node.clientHeight;
      clampOffsets();
      emitCropArea();
    };

    const setNaturalSize = (width: number, height: number) => {
      naturalWidth.value = Math.max(width, 0);
      naturalHeight.value = Math.max(height, 0);
      offsetX.value = 0;
      offsetY.value = 0;
      clampOffsets();
      emitCropArea();
    };

    const stopDragging = () => {
      dragging = false;
      activePointerId = null;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragging || activePointerId !== event.pointerId) return;
      event.preventDefault();
      const deltaX = event.clientX - dragStartX;
      const deltaY = event.clientY - dragStartY;
      offsetX.value = clamp(dragOriginX + deltaX, -maxOffsetX.value, maxOffsetX.value);
      offsetY.value = clamp(dragOriginY + deltaY, -maxOffsetY.value, maxOffsetY.value);
      emitCropArea();
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (activePointerId !== event.pointerId) return;
      stopDragging();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || naturalWidth.value <= 0 || naturalHeight.value <= 0) return;
      event.preventDefault();
      dragging = true;
      activePointerId = event.pointerId;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragOriginX = offsetX.value;
      dragOriginY = offsetY.value;
      window.addEventListener("pointermove", handlePointerMove, { passive: false });
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
    };

    const handleWheel = (event: WheelEvent) => {
      if (naturalWidth.value <= 0 || naturalHeight.value <= 0) return;
      event.preventDefault();
      const zoomRange = normalizedMaxZoom.value - normalizedMinZoom.value;
      const step = Math.max(zoomRange / 40, 0.05);
      const direction = Math.sign(event.deltaY);
      const nextZoom = currentZoom.value - direction * step;
      setZoom(nextZoom);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (naturalWidth.value <= 0 || naturalHeight.value <= 0) return;
      const panStep = 12;
      let handled = true;

      switch (event.key) {
        case "ArrowLeft":
          offsetX.value = clamp(offsetX.value - panStep, -maxOffsetX.value, maxOffsetX.value);
          break;
        case "ArrowRight":
          offsetX.value = clamp(offsetX.value + panStep, -maxOffsetX.value, maxOffsetX.value);
          break;
        case "ArrowUp":
          offsetY.value = clamp(offsetY.value - panStep, -maxOffsetY.value, maxOffsetY.value);
          break;
        case "ArrowDown":
          offsetY.value = clamp(offsetY.value + panStep, -maxOffsetY.value, maxOffsetY.value);
          break;
        case "+":
        case "=":
          setZoom(currentZoom.value + 0.1);
          break;
        case "-":
        case "_":
          setZoom(currentZoom.value - 0.1);
          break;
        default:
          handled = false;
      }

      if (handled) {
        event.preventDefault();
        emitCropArea();
      }
    };

    const imageStyle = computed<CSSProperties>(() => ({
      position: "absolute",
      left: "50%",
      top: "50%",
      width: `${imageWidth.value}px`,
      height: `${imageHeight.value}px`,
      transform: `translate(calc(-50% + ${offsetX.value}px), calc(-50% + ${offsetY.value}px))`,
      userSelect: "none",
      WebkitUserDrag: "none",
      touchAction: "none",
    }));

    const cropAreaStyle = computed<CSSProperties>(() => ({
      position: "absolute",
      left: "50%",
      top: "50%",
      width: `${cropAreaWidth.value}px`,
      height: `${cropAreaHeight.value}px`,
      transform: "translate(-50%, -50%)",
    }));

    provide<CropperContextValue>(cropperContextKey, {
      image: computed(() => props.image),
      imageStyle,
      cropAreaStyle,
      setNaturalSize,
    });

    watch(
      () => props.zoom,
      (nextZoom) => {
        if (typeof nextZoom === "number") {
          internalZoom.value = nextZoom;
        }
      }
    );

    watch(
      [cropAreaWidth, cropAreaHeight, imageWidth, imageHeight],
      () => {
        clampOffsets();
        emitCropArea();
      },
      { immediate: true }
    );

    watch(
      [offsetX, offsetY, appliedScale],
      () => {
        emitCropArea();
      },
      { immediate: true }
    );

    watch(
      () => props.image,
      () => {
        naturalWidth.value = 0;
        naturalHeight.value = 0;
        offsetX.value = 0;
        offsetY.value = 0;
      }
    );

    onMounted(() => {
      internalZoom.value = props.zoom ?? internalZoom.value;
      updateContainerSize();
      if (rootRef.value) {
        resizeObserver = new ResizeObserver(updateContainerSize);
        resizeObserver.observe(rootRef.value);
      }
    });

    onBeforeUnmount(() => {
      stopDragging();
      resizeObserver?.disconnect();
    });

    return () =>
      h(
        "div",
        mergeProps(attrs, {
          ref: rootRef,
          "data-slot": "cropper",
          class: cn(cropperRootVariants(), props.class),
          tabindex: attrs.tabindex ?? 0,
          onPointerdown: handlePointerDown,
          onWheel: handleWheel,
          onKeydown: handleKeyDown,
        }),
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
        mergeProps(attrs, {
          "data-slot": "cropper-description",
          class: cn(cropperDescriptionVariants(), props.class),
        }),
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
    const context = inject<CropperContextValue | null>(cropperContextKey, null);

    const resolvedSrc = computed(() => {
      const attributeSrc = typeof attrs.src === "string" ? attrs.src : undefined;
      return attributeSrc ?? context?.image.value;
    });

    const handleLoad = (event: Event) => {
      const target = event.target as HTMLImageElement | null;
      if (!target) return;
      context?.setNaturalSize(target.naturalWidth, target.naturalHeight);
    };

    return () =>
      h(
        "img",
        mergeProps(attrs, {
          "data-slot": "cropper-image",
          src: resolvedSrc.value,
          draggable: false,
          onLoad: handleLoad,
          class: cn(cropperImageVariants(), props.class),
          style: context?.imageStyle.value,
        })
      );
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
    const context = inject<CropperContextValue | null>(cropperContextKey, null);

    return () =>
      h(
        "div",
        mergeProps(attrs, {
          "data-slot": "cropper-crop-area",
          class: cn(cropperCropAreaVariants(), props.class),
          style: context?.cropAreaStyle.value,
        })
      );
  },
});

export default Cropper;
</script>

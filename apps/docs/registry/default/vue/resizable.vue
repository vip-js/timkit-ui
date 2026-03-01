<script lang="ts">
import { defineComponent, h, inject, provide, ref } from "vue";
import { cn } from "@/lib/utils";
import { GripVerticalIcon } from "lucide-vue-next";

const ResizableContextKey = Symbol("ResizableContext");

type Direction = "horizontal" | "vertical";

export const ResizablePanelGroup = defineComponent({
  name: "ResizablePanelGroup",
  inheritAttrs: false,
  props: {
    direction: {
      type: String as () => Direction,
      default: "horizontal",
    },
    class: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { attrs, slots }) {
    provide(ResizableContextKey, {
      direction: props.direction,
    });

    return () =>
      h(
        "div",
        {
          ...attrs,
          "data-slot": "resizable-panel-group",
          "data-panel-group-direction": props.direction,
          class: cn(
            "flex size-full data-[panel-group-direction=vertical]:flex-col",
            props.class
          ),
        },
        slots.default?.()
      );
  },
});

export const ResizablePanel = defineComponent({
  name: "ResizablePanel",
  inheritAttrs: false,
  props: {
    defaultSize: {
      type: Number,
      default: undefined,
    },
    minSize: {
      type: Number,
      default: undefined,
    },
    maxSize: {
      type: Number,
      default: undefined,
    },
    class: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { attrs, slots }) {
    const style = props.defaultSize
      ? { flexBasis: `${props.defaultSize}%`, flexGrow: 0 }
      : undefined;

    return () =>
      h(
        "div",
        {
          ...attrs,
          "data-slot": "resizable-panel",
          "data-min-size": props.minSize,
          "data-max-size": props.maxSize,
          class: props.class,
          style,
        },
        slots.default?.()
      );
  },
});

export const ResizableHandle = defineComponent({
  name: "ResizableHandle",
  inheritAttrs: false,
  props: {
    withHandle: {
      type: Boolean,
      default: false,
    },
    class: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { attrs, slots }) {
    const context = inject<{ direction: Direction }>(ResizableContextKey, {
      direction: "horizontal",
    });
    const handleRef = ref<HTMLElement | null>(null);

    const resizeByDelta = (delta: number) => {
      const handle = handleRef.value;
      if (!handle) return;

      const prev = handle.previousElementSibling as HTMLElement | null;
      const next = handle.nextElementSibling as HTMLElement | null;
      if (!prev || !next) return;

      const prevRect = prev.getBoundingClientRect();
      const nextRect = next.getBoundingClientRect();
      const prevSize = context.direction === "vertical" ? prevRect.height : prevRect.width;
      const nextSize = context.direction === "vertical" ? nextRect.height : nextRect.width;
      const total = prevSize + nextSize;

      const normalizeBound = (value: number, fallback?: number) => {
        if (!Number.isFinite(value)) return fallback;
        return Math.min(Math.max(value, 0), 100);
      };

      const prevMin = normalizeBound(parseFloat(prev.dataset.minSize || ""), undefined);
      const prevMax = normalizeBound(parseFloat(prev.dataset.maxSize || ""), undefined);
      const nextMin = normalizeBound(parseFloat(next.dataset.minSize || ""), undefined);
      const nextMax = normalizeBound(parseFloat(next.dataset.maxSize || ""), undefined);

      const minPrevPx = prevMin !== undefined ? (total * prevMin) / 100 : 24;
      let maxPrevPx = prevMax !== undefined ? (total * prevMax) / 100 : total - 24;
      const minNextPx = nextMin !== undefined ? (total * nextMin) / 100 : 24;
      let maxNextPx = nextMax !== undefined ? (total * nextMax) / 100 : total - 24;

      if (maxPrevPx < minPrevPx) maxPrevPx = minPrevPx;
      if (maxNextPx < minNextPx) maxNextPx = minNextPx;

      const unclampedPrev = prevSize + delta;
      const clampedPrev = Math.max(minPrevPx, Math.min(maxPrevPx, unclampedPrev));
      const clampedNext = Math.max(minNextPx, Math.min(maxNextPx, total - clampedPrev));
      const nextPrev = total - clampedNext;
      const nextNext = clampedNext;

      const prevPercent = Math.round((nextPrev / total) * 100);
      handle.setAttribute("aria-valuenow", `${prevPercent}`);
      handle.setAttribute("aria-valuemin", "0");
      handle.setAttribute("aria-valuemax", "100");
      handle.setAttribute("aria-valuetext", `${prevPercent}%`);

      prev.style.flexBasis = `${(nextPrev / total) * 100}%`;
      next.style.flexBasis = `${(nextNext / total) * 100}%`;
      prev.style.flexGrow = "0";
      next.style.flexGrow = "0";
    };

    const onPointerDown = (event: PointerEvent) => {
      const handle = handleRef.value;
      if (!handle) return;
      event.preventDefault();

      const prev = handle.previousElementSibling as HTMLElement | null;
      const next = handle.nextElementSibling as HTMLElement | null;
      if (!prev || !next) return;

      const isVertical = context.direction === "vertical";
      const start = isVertical ? event.clientY : event.clientX;
      const prevRect = prev.getBoundingClientRect();
      const nextRect = next.getBoundingClientRect();
      const prevSize = isVertical ? prevRect.height : prevRect.width;
      const nextSize = isVertical ? nextRect.height : nextRect.width;
      const total = prevSize + nextSize;

      const prevMin = parseFloat(prev.dataset.minSize || "");
      const prevMax = parseFloat(prev.dataset.maxSize || "");
      const nextMin = parseFloat(next.dataset.minSize || "");
      const nextMax = parseFloat(next.dataset.maxSize || "");

      const minPrevPx = Number.isFinite(prevMin) ? (total * prevMin) / 100 : 24;
      const maxPrevPx = Number.isFinite(prevMax) ? (total * prevMax) / 100 : total - 24;
      const minNextPx = Number.isFinite(nextMin) ? (total * nextMin) / 100 : 24;
      const maxNextPx = Number.isFinite(nextMax) ? (total * nextMax) / 100 : total - 24;

      const onPointerMove = (moveEvent: PointerEvent) => {
        const delta = (isVertical ? moveEvent.clientY : moveEvent.clientX) - start;
        resizeByDelta(delta);
      };

      const onPointerUp = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };

      try {
        handle.setPointerCapture(event.pointerId);
      } catch {}

      const initialPercent = Math.round((prevSize / total) * 100);
      handle.setAttribute("aria-valuenow", `${initialPercent}`);
      handle.setAttribute("aria-valuemin", "0");
      handle.setAttribute("aria-valuemax", "100");
      handle.setAttribute("aria-valuetext", `${initialPercent}%`);

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    };

    return () =>
      h(
        "div",
        {
          ...attrs,
          ref: handleRef,
          "data-slot": "resizable-handle",
          "data-panel-group-direction": context.direction,
          role: "separator",
          tabindex: 0,
          "aria-orientation": context.direction === "vertical" ? "horizontal" : "vertical",
          class: cn(
            "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2 [&[data-panel-group-direction=vertical]>div]:rotate-90",
            props.class
          ),
          onPointerdown: onPointerDown,
          onKeydown: (event: KeyboardEvent) => {
            const step = event.shiftKey ? 20 : 10;
            if (context.direction === "vertical") {
              if (event.key === "ArrowUp") resizeByDelta(-step);
              if (event.key === "ArrowDown") resizeByDelta(step);
            } else {
              if (event.key === "ArrowLeft") resizeByDelta(-step);
              if (event.key === "ArrowRight") resizeByDelta(step);
            }
          },
        },
        [
          props.withHandle
            ? h(
                "div",
                {
                  class:
                    "bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border",
                },
                h(GripVerticalIcon, { size: 10 })
              )
            : slots.default?.(),
        ]
      );
  },
});

export default ResizablePanelGroup;
</script>

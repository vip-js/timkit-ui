<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cn, timelineItemVariants } from '@timui/core';
import { injectTimelineContext } from "./timeline-context";

const props = defineProps<{
  step: number;
  disabled?: boolean;
  class?: HTMLAttributes["class"];
}>();

const context = injectTimelineContext();
context?.registerStep(props.step);

if (!context) {
  throw new Error("TimelineItem must be used within a Timeline");
}

const choose = () => {
  if (props.disabled || context.disabled.value) return
  context.setActiveStep(props.step)
}

const onKey = (event: KeyboardEvent) => {
  if (props.disabled || context.disabled.value) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    choose()
    return
  }
  const root = event.currentTarget instanceof HTMLElement ? event.currentTarget.closest('[data-slot="timeline"]') : null
  if (!root) return
  const horizontal = context.orientation.value === 'horizontal'
  const items = [...root.querySelectorAll<HTMLElement>('[data-slot="timeline-item"]')].filter(
    (node) => node.getAttribute('aria-disabled') !== 'true'
  )
  const current = event.currentTarget instanceof HTMLElement ? items.indexOf(event.currentTarget) : -1
  if (current < 0) return
  let next = current
  if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = items.length - 1
  else {
    const delta = horizontal
      ? event.key === 'ArrowRight'
        ? 1
        : event.key === 'ArrowLeft'
          ? -1
          : 0
      : event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowUp'
          ? -1
          : 0
    if (!delta) return
    next = current + delta
    if (next < 0 || next >= items.length) return
  }
  const stepValue = Number(items[next]?.dataset.step)
  if (!Number.isFinite(stepValue) || stepValue === props.step) return
  event.preventDefault()
  context.setActiveStep(stepValue)
}
</script>

<template>
  <div
    data-slot="timeline-item"
    :class="cn(timelineItemVariants(), props.class)"
    :data-state="context.activeStep.value == null ? 'inactive' : props.step === context.activeStep.value ? 'active' : props.step < context.activeStep.value ? 'completed' : 'inactive'"
    :data-completed="context.activeStep.value != null && props.step <= context.activeStep.value ? '' : undefined"
    :aria-current="context.activeStep.value != null && props.step === context.activeStep.value ? 'step' : undefined"
    :aria-disabled="props.disabled || context.disabled.value || undefined"
    :data-step="props.step"
    role="button"
    :tabindex="props.disabled || context.disabled.value ? -1 : 0"
    @click="choose"
    @keydown="onKey"
  >
    <slot />
  </div>
</template>

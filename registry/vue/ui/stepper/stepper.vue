<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import * as numberInput from "@zag-js/number-input";
import { normalizeProps, useMachine } from "@zag-js/vue";
 // using standard icons
import { cn } from "../../lib/utils";
import { cva } from "class-variance-authority";

const props = defineProps<{
  modelValue?: number;
  min?: number;
  max?: number;
  step?: number;
  class?: HTMLAttributes['class'];
  disabled?: boolean;
  readOnly?: boolean;
}>();

const emit = defineEmits(["update:modelValue", "change"]);

const context = computed(() => ({
  id: "stepper",
  value: props.modelValue,
  min: props.min,
  max: props.max,
  step: props.step,
  disabled: props.disabled,
  readOnly: props.readOnly,
  onValueChange: (details: any) => {
    emit("update:modelValue", details.valueAsNumber);
    emit("change", details);
  }
}));

const [state, send] = useMachine(numberInput.machine, context);
const api = computed(() => numberInput.connect(state, send, normalizeProps));

const stepperButtonVariants = cva(
  "flex items-center justify-center h-8 w-8 rounded-md border border-input bg-transparent text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
);

</script>

<template>
  <div v-bind="api.getRootProps()" :class="cn('flex items-center space-x-2', props.class)">
    <button v-bind="api.getDecrementTriggerProps()" :class="stepperButtonVariants()">
      <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/></svg>
    </button>
    <div class="relative">
      <input v-bind="api.getInputProps()" :class="cn(
        'flex h-9 w-20 rounded-md border border-input bg-transparent px-3 py-1 text-center text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
      )" />
    </div>
    <button v-bind="api.getIncrementTriggerProps()" :class="stepperButtonVariants()">
      <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
    </button>
  </div>
</template>

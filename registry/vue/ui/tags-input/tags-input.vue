<script setup lang="ts">
import { computed, getCurrentInstance, provide, type HTMLAttributes } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import * as tagsInput from "@zag-js/tags-input";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { tagsInputContextKey } from '../../lib/injection-keys'

const tagsInputRootVariants = cva('flex flex-col gap-2')

type TagsInputProps = {
  modelValue?: string[];
  defaultValue?: string[];
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  name?: string;
  max?: number;
  delimiter?: string;
  autoFocus?: boolean;
  addOnPaste?: boolean;
  editable?: boolean;
  inputValue?: string;
  id?: string;
  class?: HTMLAttributes["class"];
};

const props = defineProps<TagsInputProps>();
const emit = defineEmits(["update:modelValue", "valueChange", "change"]);

const machineProps = computed(() => {
  return {
    id: props.id,
    value: props.modelValue ?? props.defaultValue,
    disabled: props.disabled,
    readOnly: props.readOnly,
    name: props.name,
    max: props.max,
    delimiter: props.delimiter,
    autoFocus: props.autoFocus,
    addOnPaste: props.addOnPaste,
    editable: props.editable,
    inputValue: props.inputValue,
    onValueChange(details: { value: string[] }) {
      emit("update:modelValue", details.value);
      emit("valueChange", details);
      emit("change", details);
    },
  };
});

const service = useMachine(tagsInput.machine, machineProps as any);
const api = computed(() => tagsInput.connect(service, normalizeProps));

provide(tagsInputContextKey, api);
</script>

<template>
  <div v-bind="api.getRootProps()" data-slot="tags-input" :class="cn(tagsInputRootVariants(), props.class)">
    <slot />
  </div>
</template>

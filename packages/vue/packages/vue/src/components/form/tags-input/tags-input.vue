<script setup lang="ts">
import { computed, getCurrentInstance, provide } from "vue";
import type {
  AssertNoExtraKeys,
  TagsInputVueProps as CoreTagsInputProps,
  TagsInputApi,
  TagsInputValueChangeDetails,
} from "@timui/core";
import { cn, tagsInputRootVariants } from "@timui/core";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { tagsInputConnect, tagsInputMachine } from "@timui/core";

type TagsInputProps = CoreTagsInputProps & {
  class?: string;
};
type _TagsInputPropsGuard = AssertNoExtraKeys<TagsInputProps, CoreTagsInputProps & { class?: string }>;

const props = defineProps<TagsInputProps>();
const emit = defineEmits(["valueChange"]);

const instance = getCurrentInstance();
const machineProps = computed(() => {
  const { class: _class, id, onValueChange, ...rest } = props;
  return {
    ...rest,
    id: id ?? `tags-input-${instance?.uid ?? 0}`,
    onValueChange(details: TagsInputValueChangeDetails) {
      emit("valueChange", details);
      onValueChange?.(details);
    },
  };
});

const service = useMachine(tagsInputMachine, machineProps);
const api = computed(() => tagsInputConnect(service, normalizeProps));

provide("tags-input", api);
</script>

<template>
  <div v-bind="api.getRootProps()" data-slot="tags-input" :class="cn(tagsInputRootVariants(), props.class)">
    <slot />
  </div>
</template>

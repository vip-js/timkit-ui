<script setup lang="ts">
import { computed, getCurrentInstance, provide } from "vue";
import type {
  AssertNoExtraKeys,
  TagsInputVueProps as CoreTagsInputProps,
  TagsInputApi,
  TagsInputValueChangeDetails,
} from "@timui/core";
import { cn, tagsInputRootVariants } from "@timui/core";
import { useTagsInput } from "./use-tags-input";
import { provideTagsInputContext } from "./use-tags-input-context";

type TagsInputProps = CoreTagsInputProps & {
  class?: string;
};
type _TagsInputPropsGuard = AssertNoExtraKeys<TagsInputProps, CoreTagsInputProps & { class?: string }>;

const props = defineProps<TagsInputProps>();
const emit = defineEmits(["valueChange"]);

const instance = getCurrentInstance();
const api = useTagsInput({
  ...props,
  id: props.id ?? `tags-input-${instance?.uid ?? 0}`,
  onValueChange(details: TagsInputValueChangeDetails) {
    emit("valueChange", details);
    props.onValueChange?.(details);
  },
});

provideTagsInputContext(api);
</script>

<template>
  <div v-bind="api.getRootProps()" data-slot="tags-input" :class="cn(tagsInputRootVariants(), props.class)">
    <slot />
  </div>
</template>

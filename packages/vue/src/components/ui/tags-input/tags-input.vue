<script setup lang="ts">
import { useId } from "vue";
import type {
  AssertNoExtraKeys,
  TagsInputVueProps as CoreTagsInputProps,
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
const emit = defineEmits<{
  (event: "update:modelValue", value: string[]): void;
  (event: "change", value: string[]): void;
  (event: "valueChange", details: TagsInputValueChangeDetails): void;
}>();

const generatedId = useId();
const api = useTagsInput(
  {
    ...props,
    id: props.id ?? generatedId,
  },
  emit
);

provideTagsInputContext(api);
</script>

<template>
  <div v-bind="api.getRootProps()" data-slot="tags-input" :class="cn(tagsInputRootVariants(), props.class)">
    <slot />
  </div>
</template>

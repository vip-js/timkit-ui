<script setup lang="ts">
import type {
  AssertNoExtraKeys,
  TagsInputVueProps as CoreTagsInputProps,
  TagsInputValueChangeDetails,
} from "@timui/core";
import { computed } from "vue";
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

const api = useTagsInput(props, emit);
const tagStatus = computed(() => {
  const count = (api.value.value ?? []).filter(Boolean).length;
  if (count === 0) return "";
  return count === 1 ? "1 tag" : `${count} tags`;
});

provideTagsInputContext(api);
</script>

<template>
  <p v-if="tagStatus" role="status">{{ tagStatus }}</p>
  <div v-bind="api.getRootProps()" data-slot="tags-input" :class="cn(tagsInputRootVariants(), props.class)">
    <slot />
  </div>
</template>

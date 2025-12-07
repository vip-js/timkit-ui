<script setup lang="ts">
import { type CheckboxRootEmits, type CheckboxRootProps, CheckboxRoot, CheckboxIndicator, useForwardPropsEmits } from "radix-vue";
import { cn, checkboxStyles } from "@timui/shared";
import { computed } from "vue";
import { Check } from "lucide-vue-next";

const props = defineProps<CheckboxRootProps & { class?: string }>();
const emits = defineEmits<CheckboxRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <CheckboxRoot
    v-bind="forwarded"
    :class="cn(checkboxStyles(), props.class)"
  >
    <CheckboxIndicator
      class="flex h-full w-full items-center justify-center text-current"
    >
      <slot>
        <Check class="h-4 w-4" />
      </slot>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>

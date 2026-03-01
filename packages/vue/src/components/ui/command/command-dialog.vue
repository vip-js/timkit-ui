<script setup lang="ts">
import Dialog from "../dialog/dialog.vue";
import DialogContent from "../dialog/dialog-content.vue";
import Command from "./command.vue";
import { cn, commandDialogContentVariants, commandDialogVariants } from "@timui/core";

const props = defineProps<{ open?: boolean; defaultOpen?: boolean }>();
const emit = defineEmits(["update:open", "openChange"]);
</script>

<template>
  <Dialog :open="props.open" :defaultOpen="props.defaultOpen" @update:open="emit('update:open', $event)" @openChange="emit('openChange', $event)">
    <DialogContent :class="cn(commandDialogContentVariants(), 'shadow-lg')">
      <Command :class="commandDialogVariants()">
        <slot />
      </Command>
    </DialogContent>
  </Dialog>
</template>

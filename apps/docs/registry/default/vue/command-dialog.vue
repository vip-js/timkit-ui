<script setup lang="ts">
import Dialog from "./dialog.vue";
import DialogContent from "./dialog-content.vue";
import Command from "./command.vue";

const props = defineProps<{ open?: boolean; defaultOpen?: boolean }>();
const emit = defineEmits(["update:open", "openChange"]);
</script>

<template>
  <Dialog :open="props.open" :defaultOpen="props.defaultOpen" @update:open="emit('update:open', $event)" @openChange="emit('openChange', $event)">
    <DialogContent class="overflow-hidden p-0 shadow-lg">
      <Command
        class="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
      >
        <slot />
      </Command>
    </DialogContent>
  </Dialog>
</template>

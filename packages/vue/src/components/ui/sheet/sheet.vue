<script setup lang="ts">
import { computed, provide, watch } from "vue";
import type { AssertNoExtraKeys, SheetProps as CoreSheetProps } from "@timui/core";
import { useSheet } from "./use-sheet";
import { provideSheetContext } from "./use-sheet-context";

type SheetProps = Omit<CoreSheetProps, "id"> & { id?: string };
type _SheetPropsGuard = AssertNoExtraKeys<SheetProps, CoreSheetProps>;

const props = defineProps<SheetProps>();
let sheetId = 0;
const localId = `sheet-${++sheetId}`;

const emit = defineEmits(["update:open", "openChange"]);
const api = useSheet({
  id: props.id ?? localId,
  open: props.open,
  defaultOpen: props.defaultOpen,
  modal: true,
  onOpenChange(details) {
    emit("update:open", details.open);
    emit("openChange", details.open);
  },
});

provideSheetContext(api);

watch(
  () => props.open,
  (val?: boolean) => {
    if (val !== undefined && val !== api.value?.open) {
      api.value?.setOpen(val);
    }
  }
);
</script>

<template>
  <slot />
</template>

<script setup lang="ts">
import { computed, provide, ref } from "vue";
import { returnFocusKey, useReturnFocus } from "../use-return-focus";
import type { AssertNoExtraKeys, SheetProps as CoreSheetProps } from "@timui/core";
import { useSheet } from "./use-sheet";
import { SheetSideKey, provideSheetContext } from "./use-sheet-context";

type SheetProps = Omit<CoreSheetProps, "id"> & { id?: string; disabled?: boolean };
type _SheetPropsGuard = AssertNoExtraKeys<SheetProps, CoreSheetProps & { disabled?: boolean }>;

const props = defineProps<SheetProps>();

const emit = defineEmits(["update:open", "openChange"]);
const api = useSheet(props, emit);

provideSheetContext(api);
provide("sheet-disabled", computed(() => props.disabled === true));
provide("sheet-has-title", ref(false));
provide(SheetSideKey, computed(() => props.side));
provide(returnFocusKey, useReturnFocus(computed(() => !!api.value?.open)));
</script>

<template>
  <p v-if="api.open" role="status">Opened</p>
  <slot />
</template>

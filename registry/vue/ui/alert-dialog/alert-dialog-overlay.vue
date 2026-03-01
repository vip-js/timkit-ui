<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { alertDialogContextKey } from '../../lib/injection-keys'

const alertDialogOverlayVariants = cva(
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80'
)

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(alertDialogContextKey);
</script>

<template>
  <div v-if="api?.open" v-bind="api.getBackdropProps()" :class="cn(alertDialogOverlayVariants(), props.class)" />
</template>

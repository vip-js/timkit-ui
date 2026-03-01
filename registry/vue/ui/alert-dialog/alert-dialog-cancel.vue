<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import Button from "../button/button.vue";
import { alertDialogContextKey } from '../../lib/injection-keys'

const alertDialogCancelVariants = cva('mt-2 sm:mt-0')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(alertDialogContextKey);
</script>

<template>
  <Button variant="outline" type="button" :class="cn(alertDialogCancelVariants(), props.class)" @click="api.setOpen(false)" as-child>
     <slot />
  </Button>
</template>

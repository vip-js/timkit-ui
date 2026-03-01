<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import Button from "../button/button.vue"; // Assuming button component usually
import { alertDialogContextKey } from '../../lib/injection-keys'

const alertDialogActionVariants = cva('')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(alertDialogContextKey);
</script>

<template>
  <Button v-bind="api.getTriggerProps()" type="button" :class="cn(alertDialogActionVariants(), props.class)" @click="api.setOpen(false)" as-child>
     <slot />
  </Button>
</template>

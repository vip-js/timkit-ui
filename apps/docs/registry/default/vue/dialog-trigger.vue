<script setup lang="ts">
import { inject } from "vue";

const api = inject("dialog") as any;
</script>

<template>
  <button v-bind="api.triggerProps" data-slot="dialog-trigger">
    <slot />
  </button>
</template>

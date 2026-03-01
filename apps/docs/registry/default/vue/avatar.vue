<script setup lang="ts">
import { provide } from "vue";
import { avatarMachine } from "@timui/core";
import { useMachine } from "@zag-js/vue";
import { avatarVariants } from "@timui/core";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: string }>();

const service = useMachine(avatarMachine, { context: {} });
provide("avatar", { state: service.state, send: service.send });
</script>

<template>
  <div
    data-slot="avatar"
    :class="cn(avatarVariants(), props.class)"
  >
    <slot />
  </div>
</template>

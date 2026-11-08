<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, AvatarFallback } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Avatar @click="onDemoClick"><AvatarFallback>KK</AvatarFallback></Avatar>
</template>

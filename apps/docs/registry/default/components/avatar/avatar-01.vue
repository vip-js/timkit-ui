<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, AvatarFallback, AvatarImage } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Avatar @click="onDemoClick"><AvatarImage src="./avatar-80-07.jpg" alt="Kelly King" /><AvatarFallback>KK</AvatarFallback></Avatar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, AvatarFallback, AvatarImage } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="relative"><Avatar @click="onDemoClick"><AvatarImage src="./avatar-80-07.jpg" alt="Kelly King" /><AvatarFallback>KK</AvatarFallback></Avatar><span class="border-background bg-muted-foreground absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2"><span class="sr-only">Offline</span></span></div>
</template>

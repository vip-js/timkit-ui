<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, AvatarFallback, AvatarImage } from '@timui/vue';





const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="relative"><Avatar @click="onDemoClick"><AvatarImage src="./avatar-80-07.jpg" alt="Kelly King" /><AvatarFallback>KK</AvatarFallback></Avatar><span class="border-background absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 bg-emerald-500"><span class="sr-only">Online</span></span></div>
</template>

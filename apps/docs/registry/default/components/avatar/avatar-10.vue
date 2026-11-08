<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, AvatarFallback, AvatarImage } from '@timui/vue';
import { Badge } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="relative"><Avatar @click="onDemoClick" class="rounded-md"><AvatarImage src="./avatar-80-07.jpg" alt="Kelly King" /><AvatarFallback>KK</AvatarFallback></Avatar><Badge class="border-background absolute -top-2 left-full min-w-5 -translate-x-3 px-1">6
      </Badge></div>
</template>

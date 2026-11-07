<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDownIcon } from 'lucide-vue-next';
import { Avatar, AvatarFallback, AvatarImage } from '@timui/vue';
import { Button } from '@timui/vue';





const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Button @click="onDemoClick" :data-clicks="demoClicks" variant="ghost" class="h-auto p-0 hover:bg-transparent"><Avatar><AvatarImage src="./avatar.jpg" alt="Profile image" /><AvatarFallback>KK</AvatarFallback></Avatar><ChevronDownIcon :size="16" class="opacity-60" aria-hidden="true" /></Button>
</template>

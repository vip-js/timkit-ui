<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@timui/vue';





const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="flex -space-x-3"><img class="ring-background rounded-full ring-2" src="/avatar-80-03.jpg" :width="40" :height="40" alt="Avatar 01" /><img class="ring-background rounded-full ring-2" src="/avatar-80-04.jpg" :width="40" :height="40" alt="Avatar 02" /><img class="ring-background rounded-full ring-2" src="/avatar-80-05.jpg" :width="40" :height="40" alt="Avatar 03" /><img class="ring-background rounded-full ring-2" src="/avatar-80-06.jpg" :width="40" :height="40" alt="Avatar 04" /><Button @click="onDemoClick" :data-clicks="demoClicks" variant="secondary" class="bg-secondary text-muted-foreground ring-background hover:bg-secondary hover:text-foreground flex size-10 items-center justify-center rounded-full text-xs ring-2" size="icon">+3
      </Button></div>
</template>

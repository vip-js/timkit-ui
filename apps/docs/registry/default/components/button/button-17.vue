<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Button @click="onDemoClick" :data-clicks="demoClicks" class="gap-0 rounded-full py-0 ps-0"><div class="me-0.5 flex aspect-square h-full p-1.5"><img class="h-auto w-full rounded-full" src="avatar.jpg" alt="Profile image" :width="24" :height="24" aria-hidden="true" /></div>@georgelucas
    </Button>
</template>

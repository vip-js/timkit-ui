<script setup lang="ts">
import { ref } from 'vue'
import { Badge } from '@timui/vue';





const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Badge @click="onDemoClick" variant="outline" class="gap-1.5"><span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Badge
    </Badge>
</template>

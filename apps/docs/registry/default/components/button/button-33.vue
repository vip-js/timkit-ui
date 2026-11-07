<script setup lang="ts">
import { ref } from 'vue'
import { EllipsisIcon, FilesIcon, FilmIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';





const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="inline-flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse"><Button @click="onDemoClick" :data-clicks="demoClicks" class="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10" variant="outline"><FilesIcon class="-ms-1 opacity-60" :size="16" aria-hidden="true" />Files
      </Button><Button class="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10" variant="outline"><FilmIcon class="-ms-1 opacity-60" :size="16" aria-hidden="true" />Media
      </Button><Button class="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10" variant="outline" size="icon" aria-label="Menu"><EllipsisIcon :size="16" aria-hidden="true" /></Button></div>
</template>

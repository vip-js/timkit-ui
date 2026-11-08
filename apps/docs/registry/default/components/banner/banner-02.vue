<script setup lang="ts">
import { ref } from 'vue'
import { Banner } from '@timui/vue';
import { BannerContent } from '@timui/vue';
import { BannerDescription } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Banner @click="onDemoClick" class="dark bg-muted text-foreground px-4 py-3"><BannerContent class="justify-center"><BannerDescription class="text-sm text-foreground"><a href="#" class="group"><span class="me-1 text-base leading-none">✨</span>Introducing transactional and marketing emails
            <svg class="ms-2 -mt-0.5 inline-flex opacity-60 transition-transform group-hover:translate-x-0.5" :width="16" :height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></svg></a></BannerDescription></BannerContent></Banner>
</template>

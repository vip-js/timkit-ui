<script setup lang="ts">
import { ref } from 'vue'
import { QrCodeIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="divide-primary-foreground/30 inline-flex divide-x rounded-md shadow-xs rtl:space-x-reverse"><Button @click="onDemoClick" :data-clicks="demoClicks" class="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10" size="icon" aria-label="QR code"><QrCodeIcon :size="16" aria-hidden="true" /></Button><Button class="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10">Sign in
      </Button></div>
</template>

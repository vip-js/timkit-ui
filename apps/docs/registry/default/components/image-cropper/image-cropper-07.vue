<script setup lang="ts">
import { ref } from 'vue'
import { Cropper, CropperCropArea, CropperDescription, CropperImage } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="flex flex-col items-center gap-2"><Cropper @click="onDemoClick" class="h-80" image="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/cropper-06_dduwky.jpg"><CropperDescription /><CropperImage /><CropperCropArea class="rounded-full" /></Cropper><p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-xs">Cropper with full-rounded mask ∙{{ ' ' }}<a href="https://github.com/origin-space/image-cropper" class="hover:text-foreground underline" target="_blank">API
        </a></p></div>
</template>

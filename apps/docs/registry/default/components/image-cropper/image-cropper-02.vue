<script setup lang="ts">
import { Cropper, CropperCropArea, CropperDescription, CropperImage } from '@timui/vue';




</script>

<template>
  <div class="flex flex-col items-center gap-2"><Cropper class="h-80" image="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/cropper-01_bcxaic.jpg"><CropperDescription /><CropperImage /><CropperCropArea /></Cropper><p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-xs">Basic cropper ∙{{ ' ' }}<a href="https://github.com/origin-space/image-cropper" class="hover:text-foreground underline" target="_blank">API
        </a></p></div>
</template>

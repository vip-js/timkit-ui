<script setup lang="ts">
import { Cropper, CropperCropArea, CropperDescription, CropperImage } from '@/components/ui/image-cropper';



</script>

<template>
  <div class="flex flex-col items-center gap-2"><Cropper class="h-80 bg-black" image="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/cropper-04_jflxhw.jpg"><CropperDescription /><CropperImage /><CropperCropArea class="shadow-[0_0_0_9999px_rgba(255,255,255,0.5)]" /></Cropper><p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-xs">Cropper with custom mask overlay ∙{{ ' ' }}<a href="https://github.com/origin-space/image-cropper" class="hover:text-foreground underline" target="_blank">API
        </a></p></div>
</template>

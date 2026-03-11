<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Cropper, CropperCropArea, CropperDescription, CropperImage } from '@/components/ui/image-cropper';



</script>

<template>
  <div class="flex flex-col items-center gap-2"><div class="flex w-full flex-col gap-4 md:flex-row"><Cropper class="h-64 md:flex-1" :image="ORIGINAL_IMAGE_URL" :onCropChange="handleCropChange"><CropperDescription /><CropperImage /><CropperCropArea /></Cropper><div class="flex w-26 flex-col gap-4"><Button @click="handleCrop" :disabled="!croppedAreaPixels">Crop preview
          </Button><div class="aspect-square w-full shrink-0 overflow-hidden rounded-lg border">{{ croppedImageUrl ? (
              <img
                src={croppedImageUrl}
                alt="Cropped result"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="bg-muted text-muted-foreground/80 flex h-full w-full items-center justify-center p-2 text-center text-xs">
                Image preview
              </div>
            ) }}</div></div></div><p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-xs">Cropper with image preview ∙{{ ' ' }}<a href="https://github.com/origin-space/image-cropper" class="hover:text-foreground underline" target="_blank" rel="noopener noreferrer">API
        </a></p></div>
</template>

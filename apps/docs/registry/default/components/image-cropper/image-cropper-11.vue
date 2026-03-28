<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@timui/vue';
import { Cropper, CropperCropArea, CropperDescription, CropperImage } from '@timui/vue';



const croppedAreaPixels = ref<Area | null>(null);
const croppedImageUrl = ref<string | null>(null);

</script>

<template>
  <div class="flex flex-col items-center gap-2"><div class="flex w-full flex-col gap-4 md:flex-row"><Cropper class="h-64 md:flex-1" :image="ORIGINAL_IMAGE_URL" :onCropChange="handleCropChange"><CropperDescription /><CropperImage /><CropperCropArea /></Cropper><div class="flex w-26 flex-col gap-4"><Button @click="handleCrop" :disabled="!croppedAreaPixels">Crop preview
          </Button><div class="aspect-square w-full shrink-0 overflow-hidden rounded-lg border"><template v-if="croppedImageUrl">
<img :src="croppedImageUrl" alt="Cropped result" class="h-full w-full object-cover" />
</template>
<template v-else>
<div class="bg-muted text-muted-foreground/80 flex h-full w-full items-center justify-center p-2 text-center text-xs">Image preview
              </div>
</template></div></div></div><p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-xs">Cropper with image preview ∙{{ ' ' }}<a href="https://github.com/origin-space/image-cropper" class="hover:text-foreground underline" target="_blank" rel="noopener noreferrer">API
        </a></p></div>
</template>

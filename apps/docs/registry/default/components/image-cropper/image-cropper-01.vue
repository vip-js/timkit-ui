<script setup lang="ts">
import { ArrowLeftIcon, CircleUserRoundIcon, XIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Cropper, CropperCropArea, CropperDescription, CropperImage } from '@/components/ui/image-cropper';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { useFileUpload } from '@/registry/default/hooks/use-file-upload.vue';


</script>

<template>
  <div class="flex flex-col items-center gap-2"><div class="relative inline-flex"><button class="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex size-16 items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none" @click="openFileDialog" :onDragEnter="handleDragEnter" :onDragLeave="handleDragLeave" :onDragOver="handleDragOver" :onDrop="handleDrop" :data-dragging="isDragging || undefined" :aria-label="finalImageUrl ? 'Change image' : 'Upload image'">{{ finalImageUrl ? (
            <img
              className="size-full object-cover"
              src={finalImageUrl}
              alt="User avatar"
              width={64}
              height={64}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="size-4 opacity-60" />
            </div>
          ) }}</button><Button v-if="finalImageUrl" @click="handleRemoveFinalImage" size="icon" class="border-background focus-visible:border-background absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none" aria-label="Remove image"><XIcon class="size-3.5" /></Button><input class="sr-only" aria-label="Upload image file" :tabIndex="-1" /></div><Dialog :open="isDialogOpen" @update:open="setIsDialogOpen"><DialogContent class="gap-0 p-0 sm:max-w-140 *:[button]:hidden"><DialogDescription class="sr-only">Crop image dialog</DialogDescription><DialogHeader class="contents space-y-0 text-left"><DialogTitle class="flex items-center justify-between border-b p-4 text-base"><div class="flex items-center gap-2"><Button type="button" variant="ghost" size="icon" class="-my-1 opacity-60" @click="setIsDialogOpen(false)" aria-label="Cancel"><ArrowLeftIcon aria-hidden="true" /></Button><span>Crop image</span></div><Button class="-my-1" @click="handleApply" :disabled="!previewUrl" autoFocus>Apply
              </Button></DialogTitle></DialogHeader><Cropper v-if="previewUrl" class="h-96 sm:h-120" :image="previewUrl" :zoom="zoom" :onCropChange="handleCropChange" :onZoomChange="setZoom"><CropperDescription /><CropperImage /><CropperCropArea /></Cropper><DialogFooter class="border-t px-4 py-6"><div class="mx-auto flex w-full max-w-80 items-center gap-4"><ZoomOutIcon class="shrink-0 opacity-60" :size="16" aria-hidden="true" /><Slider :default-value="[1]" :value="[zoom]" :min="1" :max="3" :step="0.1" @update:modelValue="setZoom(value[0])" aria-label="Zoom slider" /><ZoomInIcon class="shrink-0 opacity-60" :size="16" aria-hidden="true" /></div></DialogFooter></DialogContent></Dialog><p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-xs">Avatar{{ ' ' }}<a href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md" class="hover:text-foreground underline" target="_blank">uploader
        </a>{{ ' ' }}with{{ ' ' }}<a href="https://github.com/origin-space/image-cropper" class="hover:text-foreground underline" target="_blank">cropper
        </a></p></div>
</template>

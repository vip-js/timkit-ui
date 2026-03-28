<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { ArrowLeftIcon, CircleUserRoundIcon, XIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { Cropper, CropperCropArea, CropperDescription, CropperImage } from '@timui/vue';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@timui/vue';
import { Slider } from '@timui/vue';
import { useFileUpload } from '@/registry/default/hooks/use-file-upload-vue';

type Area = { x: number; y: number; width: number; height: number };

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  outputWidth: number = pixelCrop.width,
  outputHeight: number = pixelCrop.height,
): Promise<Blob | null> {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      outputWidth,
      outputHeight,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg');
    });
  } catch (error) {
    console.error('Error in getCroppedImg:', error);
    return null;
  }
}

const [
  { files, isDragging },
  {
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    openFileDialog,
    removeFile,
    getInputProps,
  },
] = useFileUpload({
  accept: 'image/*',
});

const previewUrl = computed(() => files.value[0]?.preview ?? null);
const fileId = computed(() => files.value[0]?.id ?? null);

const finalImageUrl = ref<string | null>(null);
const isDialogOpen = ref(false);
const croppedAreaPixels = ref<Area | null>(null);
const zoom = ref(1);
const previousFileId = ref<string | null>(null);

function setIsDialogOpen(nextOpen: boolean) {
  isDialogOpen.value = nextOpen;
}

function setZoom(nextZoom: number) {
  zoom.value = nextZoom;
}

function handleCropChange(pixels: Area | null) {
  croppedAreaPixels.value = pixels;
}

function handleZoomValueChange(values: number[]) {
  setZoom(values[0] ?? 1);
}

async function handleApply() {
  if (!previewUrl.value || !fileId.value) {
    return;
  }

  let area = croppedAreaPixels.value;

  if (!area) {
    const image = await createImage(previewUrl.value);
    area = {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    };
  }

  const croppedBlob = await getCroppedImg(previewUrl.value, area);
  if (!croppedBlob) {
    isDialogOpen.value = false;
    return;
  }

  const nextFinalImageUrl = URL.createObjectURL(croppedBlob);

  if (finalImageUrl.value?.startsWith('blob:')) {
    URL.revokeObjectURL(finalImageUrl.value);
  }

  finalImageUrl.value = nextFinalImageUrl;
  isDialogOpen.value = false;
}

function handleRemoveFinalImage() {
  if (finalImageUrl.value?.startsWith('blob:')) {
    URL.revokeObjectURL(finalImageUrl.value);
  }
  finalImageUrl.value = null;

  const currentFileId = fileId.value;
  if (currentFileId) {
    removeFile(currentFileId);
  }
}

watch(fileId, (nextFileId) => {
  if (nextFileId && nextFileId !== previousFileId.value) {
    isDialogOpen.value = true;
    croppedAreaPixels.value = null;
    zoom.value = 1;
  }
  previousFileId.value = nextFileId;
});

onBeforeUnmount(() => {
  if (finalImageUrl.value?.startsWith('blob:')) {
    URL.revokeObjectURL(finalImageUrl.value);
  }
});
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <div class="relative inline-flex">
      <button
        class="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex size-16 items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none"
        @click="openFileDialog"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @dragover="handleDragOver"
        @drop="handleDrop"
        :data-dragging="isDragging || undefined"
        :aria-label="finalImageUrl ? 'Change image' : 'Upload image'"
      >
        <template v-if="finalImageUrl">
          <img
            class="size-full object-cover"
            :src="finalImageUrl"
            alt="User avatar"
            :width="64"
            :height="64"
            :style="{ objectFit: 'cover' }"
          />
        </template>
        <template v-else>
          <div aria-hidden="true">
            <CircleUserRoundIcon class="size-4 opacity-60" />
          </div>
        </template>
      </button>

      <Button
        v-if="finalImageUrl"
        @click="handleRemoveFinalImage"
        size="icon"
        class="border-background focus-visible:border-background absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none"
        aria-label="Remove image"
      >
        <XIcon class="size-3.5" />
      </Button>

      <input
        v-bind="getInputProps()"
        class="sr-only"
        aria-label="Upload image file"
        :tabIndex="-1"
      />
    </div>

    <Dialog :open="isDialogOpen" @update:open="setIsDialogOpen">
      <DialogContent class="gap-0 p-0 sm:max-w-140 *:[button]:hidden">
        <DialogDescription class="sr-only">Crop image dialog</DialogDescription>
        <DialogHeader class="contents space-y-0 text-left">
          <DialogTitle class="flex items-center justify-between border-b p-4 text-base">
            <div class="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                class="-my-1 opacity-60"
                @click="setIsDialogOpen(false)"
                aria-label="Cancel"
              >
                <ArrowLeftIcon aria-hidden="true" />
              </Button>
              <span>Crop image</span>
            </div>
            <Button class="-my-1" @click="handleApply" :disabled="!previewUrl" autoFocus>
              Apply
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Cropper
          v-if="previewUrl"
          class="h-96 sm:h-120"
          :image="previewUrl"
          :zoom="zoom"
          :onCropChange="handleCropChange"
          :onZoomChange="setZoom"
        >
          <CropperDescription />
          <CropperImage />
          <CropperCropArea />
        </Cropper>

        <DialogFooter class="border-t px-4 py-6">
          <div class="mx-auto flex w-full max-w-80 items-center gap-4">
            <ZoomOutIcon class="shrink-0 opacity-60" :size="16" aria-hidden="true" />
            <Slider
              :default-value="[1]"
              :value="[zoom]"
              :min="1"
              :max="3"
              :step="0.1"
              @update:modelValue="handleZoomValueChange"
              aria-label="Zoom slider"
            />
            <ZoomInIcon class="shrink-0 opacity-60" :size="16" aria-hidden="true" />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-xs">
      Avatar
      <a
        href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md"
        class="hover:text-foreground underline"
        target="_blank"
      >
        uploader
      </a>
      with
      <a
        href="https://github.com/origin-space/image-cropper"
        class="hover:text-foreground underline"
        target="_blank"
      >
        cropper
      </a>
    </p>
  </div>
</template>

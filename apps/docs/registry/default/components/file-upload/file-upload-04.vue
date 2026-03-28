<script setup lang="ts">
import { computed } from 'vue'
import { AlertCircleIcon, ImageUpIcon, XIcon } from 'lucide-vue-next'
import { Button } from '@timui/vue'
import { useFileUpload } from '@/registry/default/hooks/use-file-upload-vue'

const maxSizeMB = 5
const maxSize = maxSizeMB * 1024 * 1024

const [
  { files, isDragging, errors },
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
  maxSize,
})

const previewUrl = computed(() => files.value[0]?.preview ?? null)

function removeCurrentFile() {
  const fileId = files.value[0]?.id
  if (fileId) {
    removeFile(fileId)
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="relative">
      <div
        role="button"
        @click="openFileDialog"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @dragover="handleDragOver"
        @drop="handleDrop"
        :data-dragging="isDragging || undefined"
        class="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]"
      >
        <input v-bind="getInputProps()" class="sr-only" aria-label="Upload file" />
        <template v-if="previewUrl">
          <div class="absolute inset-0">
            <img :src="previewUrl" :alt="files[0]?.file?.name || 'Uploaded image'" class="size-full object-cover" />
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              class="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <ImageUpIcon class="size-4 opacity-60" />
            </div>
            <p class="mb-1.5 text-sm font-medium">Drop your image here or click to browse</p>
            <p class="text-muted-foreground text-xs">Max size: {{ maxSizeMB }}MB</p>
          </div>
        </template>
      </div>

      <div v-if="previewUrl" class="absolute top-4 right-4">
        <Button
          size="icon"
          type="button"
          class="size-8 rounded-full bg-black/60 text-white shadow-none hover:bg-black/80"
          @click="removeCurrentFile"
          aria-label="Remove image"
        >
          <XIcon class="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>

    <div v-if="errors.length > 0" class="text-destructive flex items-center gap-1 text-xs" role="alert">
      <AlertCircleIcon class="size-3 shrink-0" />
      <span>{{ errors[0] }}</span>
    </div>

    <p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-center text-xs">
      Single image uploader w/ max size ∙
      <a
        href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md"
        class="hover:text-foreground underline"
      >
        API
      </a>
    </p>
  </div>
</template>

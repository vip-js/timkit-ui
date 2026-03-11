<script setup lang="ts">
import { AlertCircleIcon, ImageUpIcon, XIcon } from 'lucide-vue-next';
import { useFileUpload } from '@/registry/default/hooks/use-file-upload.vue';


</script>

<template>
  <div class="flex flex-col gap-2"><div class="relative"><div role="button" @click="openFileDialog" :onDragEnter="handleDragEnter" :onDragLeave="handleDragLeave" :onDragOver="handleDragOver" :onDrop="handleDrop" :data-dragging="isDragging || undefined" class="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]"><input class="sr-only" aria-label="Upload file" />{{ previewUrl ? (
            <div className="absolute inset-0">
              <img
                src={previewUrl}
                alt={files[0]?.file?.name || 'Uploaded image'}
                className="size-full object-cover"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <ImageUpIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">Drop your image here or click to browse</p>
              <p className="text-muted-foreground text-xs">Max size: {maxSizeMB}MB</p>
            </div>
          ) }}</div><div v-if="previewUrl" class="absolute top-4 right-4"><button type="button" class="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]" @click="removeFile(files[0]?.id)" aria-label="Remove image"><XIcon class="size-4" aria-hidden="true" /></button></div></div><div v-if="errors.length > 0" class="text-destructive flex items-center gap-1 text-xs" role="alert"><AlertCircleIcon class="size-3 shrink-0" /><span>{{ errors[0] }}</span></div><p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-center text-xs">Single image uploader w/ max size ∙{{ ' ' }}<a href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md" class="hover:text-foreground underline">API
        </a></p></div>
</template>

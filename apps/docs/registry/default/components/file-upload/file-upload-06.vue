<script setup lang="ts">
import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { useFileUpload } from '@/registry/default/hooks/use-file-upload-vue';

const initialFiles = [
  {
    name: 'image-01.jpg',
    size: 1528737,
    type: 'image/jpeg',
    url: 'https://picsum.photos/1000/800?grayscale&random=1',
    id: 'image-01-123456789',
  },
  {
    name: 'image-02.jpg',
    size: 1528737,
    type: 'image/jpeg',
    url: 'https://picsum.photos/1000/800?grayscale&random=2',
    id: 'image-02-123456789',
  },
  {
    name: 'image-03.jpg',
    size: 1528737,
    type: 'image/jpeg',
    url: 'https://picsum.photos/1000/800?grayscale&random=3',
    id: 'image-03-123456789',
  },
  {
    name: 'image-04.jpg',
    size: 1528737,
    type: 'image/jpeg',
    url: 'https://picsum.photos/1000/800?grayscale&random=4',
    id: 'image-04-123456789',
  },
];

const maxSizeMB = 5;
const maxSize = maxSizeMB * 1024 * 1024;
const maxFiles = 6;

const [
  { files, isDragging, errors },
  {
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    openFileDialog,
    removeFile,
  },
] = useFileUpload({
  accept: 'image/svg+xml,image/png,image/jpeg,image/jpg,image/gif',
  maxSize,
  multiple: true,
  maxFiles,
  initialFiles,
});
</script>

<template>
  <div class="flex flex-col gap-2"><div @dragenter="handleDragEnter" @dragleave="handleDragLeave" @dragover="handleDragOver" @drop="handleDrop" :data-dragging="isDragging || undefined" :data-files="files.length > 0 || undefined" class="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"><input class="sr-only" aria-label="Upload image file" /><template v-if="files.length > 0">
<div class="flex w-full flex-col gap-3"><div class="flex items-center justify-between gap-2"><h3 class="truncate text-sm font-medium">Uploaded Files ({{ files.length }})</h3><Button variant="outline" size="sm" @click="openFileDialog" :disabled="files.length >= maxFiles"><UploadIcon class="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />Add more
              </Button></div><div class="grid grid-cols-2 gap-4 md:grid-cols-3"><div v-for="(file, index) in files" :key="file.id" class="bg-accent relative aspect-square rounded-md"><img :src="file.preview" :alt="file.file.name" class="size-full rounded-[inherit] object-cover" /><Button @click="removeFile(file.id)" size="icon" class="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none" aria-label="Remove image"><XIcon class="size-3.5" /></Button></div></div></div>
</template>
<template v-else>
<div class="flex flex-col items-center justify-center px-4 py-3 text-center"><div class="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true"><ImageIcon class="size-4 opacity-60" /></div><p class="mb-1.5 text-sm font-medium">Drop your images here</p><p class="text-muted-foreground text-xs">SVG, PNG, JPG or GIF (max. {{ maxSizeMB }}MB)
            </p><Button variant="outline" class="mt-4" @click="openFileDialog"><UploadIcon class="-ms-1 opacity-60" aria-hidden="true" />Select images
            </Button></div>
</template></div><div v-if="errors.length > 0" class="text-destructive flex items-center gap-1 text-xs" role="alert"><AlertCircleIcon class="size-3 shrink-0" /><span>{{ errors[0] }}</span></div><p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-center text-xs">Multiple image uploader w/ image grid ∙{{ ' ' }}<a href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md" class="hover:text-foreground underline">API
        </a></p></div>
</template>

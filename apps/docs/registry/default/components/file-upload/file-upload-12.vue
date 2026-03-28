<script setup lang="ts">
import { AlertCircleIcon, FileArchiveIcon, FileIcon, FileSpreadsheetIcon, FileTextIcon, HeadphonesIcon, ImageIcon, Trash2Icon, UploadIcon, VideoIcon, XIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { formatBytes, useFileUpload, type FileWithPreview } from '@/registry/default/hooks/use-file-upload-vue';

const initialFiles = [
  {
    name: 'intro.zip',
    size: 252873,
    type: 'application/zip',
    url: 'https://example.com/intro.zip',
    id: 'intro.zip-1744638436563-8u5xuls',
  },
  {
    name: 'image-01.jpg',
    size: 1528737,
    type: 'image/jpeg',
    url: 'https://picsum.photos/1000/800?grayscale&random=1',
    id: 'image-01-123456789',
  },
  {
    name: 'audio.mp3',
    size: 1528737,
    type: 'audio/mpeg',
    url: 'https://example.com/audio.mp3',
    id: 'audio-123456789',
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
    clearFiles,
  },
] = useFileUpload({
  multiple: true,
  maxFiles,
  maxSize,
  initialFiles,
});

function getFileIcon(file: FileWithPreview) {
  const fileType = file.file.type;
  const fileName = file.file.name;

  if (
    fileType.includes('pdf') ||
    fileType.includes('word') ||
    fileName.endsWith('.pdf') ||
    fileName.endsWith('.doc') ||
    fileName.endsWith('.docx')
  ) {
    return FileTextIcon;
  }

  if (
    fileType.includes('zip') ||
    fileType.includes('archive') ||
    fileName.endsWith('.zip') ||
    fileName.endsWith('.rar')
  ) {
    return FileArchiveIcon;
  }

  if (
    fileType.includes('excel') ||
    fileName.endsWith('.xls') ||
    fileName.endsWith('.xlsx')
  ) {
    return FileSpreadsheetIcon;
  }

  if (fileType.includes('video/')) return VideoIcon;
  if (fileType.includes('audio/')) return HeadphonesIcon;
  if (fileType.startsWith('image/')) return ImageIcon;
  return FileIcon;
}

function getFilePreview(file: FileWithPreview) {
  if (file.file.type.startsWith('image/')) {
    return file.preview;
  }
  return null;
}
</script>

<template>
  <div class="flex flex-col gap-2"><div @dragenter="handleDragEnter" @dragleave="handleDragLeave" @dragover="handleDragOver" @drop="handleDrop" :data-dragging="isDragging || undefined" :data-files="files.length > 0 || undefined" class="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"><input class="sr-only" aria-label="Upload image file" /><template v-if="files.length > 0">
<div class="flex w-full flex-col gap-3"><div class="flex items-center justify-between gap-2"><h3 class="truncate text-sm font-medium">Files ({{ files.length }})</h3><div class="flex gap-2"><Button variant="outline" size="sm" @click="openFileDialog"><UploadIcon class="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />Add files
                </Button><Button variant="outline" size="sm" @click="clearFiles"><Trash2Icon class="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />Remove all
                </Button></div></div><div class="grid grid-cols-2 gap-4 md:grid-cols-3"><div v-for="(file, index) in files" :key="file.id" class="bg-background relative flex flex-col rounded-md border"><div class="bg-accent flex aspect-square items-center justify-center overflow-hidden rounded-t-[inherit]"><img v-if="getFilePreview(file)" :src="getFilePreview(file) || ''" :alt="file.file.name" class="size-full rounded-t-[inherit] object-cover" /><component v-else :is="getFileIcon(file)" class="size-5 opacity-60" /></div><Button @click="removeFile(file.id)" size="icon" class="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none" aria-label="Remove image"><XIcon class="size-3.5" /></Button><div class="flex min-w-0 flex-col gap-0.5 border-t p-3"><p class="truncate text-[13px] font-medium">{{ file.file.name }}</p><p class="text-muted-foreground truncate text-xs">{{ formatBytes(file.file.size) }}</p></div></div></div></div>
</template>
<template v-else>
<div class="flex flex-col items-center justify-center px-4 py-3 text-center"><div class="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true"><ImageIcon class="size-4 opacity-60" /></div><p class="mb-1.5 text-sm font-medium">Drop your files here</p><p class="text-muted-foreground text-xs">Max {{ maxFiles }}files ∙ Up to {{ maxSizeMB }}MB
            </p><Button variant="outline" class="mt-4" @click="openFileDialog"><UploadIcon class="-ms-1 opacity-60" aria-hidden="true" />Select images
            </Button></div>
</template></div><div v-if="errors.length > 0" class="text-destructive flex items-center gap-1 text-xs" role="alert"><AlertCircleIcon class="size-3 shrink-0" /><span>{{ errors[0] }}</span></div><p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-center text-xs">Mixed content w/ card ∙{{ ' ' }}<a href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md" class="hover:text-foreground underline">API
        </a></p></div>
</template>

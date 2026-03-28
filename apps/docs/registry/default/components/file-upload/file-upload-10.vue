<script setup lang="ts">
import { AlertCircleIcon, FileArchiveIcon, FileIcon, FileSpreadsheetIcon, FileTextIcon, HeadphonesIcon, ImageIcon, Trash2Icon, UploadIcon, VideoIcon, XIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { formatBytes, useFileUpload } from '@/registry/default/hooks/use-file-upload-vue';

const initialFiles = [
  {
    name: 'document.pdf',
    size: 528737,
    type: 'application/pdf',
    url: 'https://example.com/document.pdf',
    id: 'document.pdf-1744638436563-8u5xuls',
  },
  {
    name: 'intro.zip',
    size: 252873,
    type: 'application/zip',
    url: 'https://example.com/intro.zip',
    id: 'intro.zip-1744638436563-8u5xuls',
  },
  {
    name: 'conclusion.xlsx',
    size: 352873,
    type: 'application/xlsx',
    url: 'https://example.com/conclusion.xlsx',
    id: 'conclusion.xlsx-1744638436563-8u5xuls',
  },
];

const maxSize = 10;
const maxSizeBytes = maxSize * 1024 * 1024;
const maxFiles = 10;

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
  maxSize: maxSizeBytes,
  initialFiles,
});

function getFileIcon(file: { file: File | { type: string; name: string } }) {
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
</script>

<template>
  <div class="flex flex-col gap-2"><div @dragenter="handleDragEnter" @dragleave="handleDragLeave" @dragover="handleDragOver" @drop="handleDrop" :data-dragging="isDragging || undefined" :data-files="files.length > 0 || undefined" class="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-56 flex-col items-center rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"><input class="sr-only" aria-label="Upload files" /><template v-if="files.length > 0">
<div class="flex w-full flex-col gap-3"><div class="flex items-center justify-between gap-2"><h3 class="truncate text-sm font-medium">Uploaded Files ({{ files.length }})</h3><Button variant="outline" size="sm" @click="clearFiles"><Trash2Icon class="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />Remove all
              </Button></div><div class="w-full space-y-2"><div v-for="(file, index) in files" :key="file.id" class="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3"><div class="flex items-center gap-3 overflow-hidden"><div class="flex aspect-square size-10 shrink-0 items-center justify-center rounded border"><component :is="getFileIcon(file)" class="size-4 opacity-60" /></div><div class="flex min-w-0 flex-col gap-0.5"><p class="truncate text-[13px] font-medium">{{ file.file.name }}</p><p class="text-muted-foreground text-xs">{{ formatBytes(file.file.size) }}</p></div></div><Button size="icon" variant="ghost" class="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent" @click="removeFile(file.id)" aria-label="Remove file"><XIcon class="size-4" aria-hidden="true" /></Button></div><Button v-if="files.length < maxFiles" variant="outline" class="mt-2 w-full" @click="openFileDialog"><UploadIcon class="-ms-1 opacity-60" aria-hidden="true" />Add more
                </Button></div></div>
</template>
<template v-else>
<div class="flex flex-col items-center justify-center text-center"><div class="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true"><FileIcon class="size-4 opacity-60" /></div><p class="mb-1.5 text-sm font-medium">Upload files</p><p class="text-muted-foreground text-xs">Max {{ maxFiles }}files ∙ Up to {{ maxSize }}MB
            </p><Button variant="outline" class="mt-4" @click="openFileDialog"><UploadIcon class="-ms-1 opacity-60" aria-hidden="true" />Select files
            </Button></div>
</template></div><div v-if="errors.length > 0" class="text-destructive flex items-center gap-1 text-xs" role="alert"><AlertCircleIcon class="size-3 shrink-0" /><span>{{ errors[0] }}</span></div><p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-center text-xs">Multiple files uploader w/ list inside ∙{{ ' ' }}<a href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md" class="hover:text-foreground underline">API
        </a></p></div>
</template>

<script setup lang="ts">
import { AlertCircleIcon, FileArchiveIcon, FileIcon, FileSpreadsheetIcon, FileTextIcon, FileUpIcon, HeadphonesIcon, ImageIcon, VideoIcon, XIcon } from 'lucide-vue-next';
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

const maxSize = 100 * 1024 * 1024;
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
  maxSize,
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
  <div class="flex flex-col gap-2"><div role="button" @click="openFileDialog" @dragenter="handleDragEnter" @dragleave="handleDragLeave" @dragover="handleDragOver" @drop="handleDrop" :data-dragging="isDragging || undefined" class="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"><input class="sr-only" aria-label="Upload files" /><div class="flex flex-col items-center justify-center text-center"><div class="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true"><FileUpIcon class="size-4 opacity-60" /></div><p class="mb-1.5 text-sm font-medium">Upload files</p><p class="text-muted-foreground mb-2 text-xs">Drag & drop or click to browse</p><div class="text-muted-foreground/70 flex flex-wrap justify-center gap-1 text-xs"><span>All files</span><span>∙</span><span>Max {{ maxFiles }}files</span><span>∙</span><span>Up to {{ formatBytes(maxSize) }}</span></div></div></div><div v-if="errors.length > 0" class="text-destructive flex items-center gap-1 text-xs" role="alert"><AlertCircleIcon class="size-3 shrink-0" /><span>{{ errors[0] }}</span></div><div v-if="files.length > 0" class="space-y-2"><div v-for="(file, index) in files" :key="file.id" class="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3"><div class="flex items-center gap-3 overflow-hidden"><div class="flex aspect-square size-10 shrink-0 items-center justify-center rounded border"><component :is="getFileIcon(file)" class="size-4 opacity-60" /></div><div class="flex min-w-0 flex-col gap-0.5"><p class="truncate text-[13px] font-medium">{{ file.file.name }}</p><p class="text-muted-foreground text-xs">{{ formatBytes(file.file.size) }}</p></div></div><Button size="icon" variant="ghost" class="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent" @click="removeFile(file.id)" aria-label="Remove file"><XIcon class="size-4" aria-hidden="true" /></Button></div><div v-if="files.length > 1"><Button size="sm" variant="outline" @click="clearFiles">Remove all files
              </Button></div></div><p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-center text-xs">Multiple files uploader w/ list ∙{{ ' ' }}<a href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md" class="hover:text-foreground underline">API
        </a></p></div>
</template>

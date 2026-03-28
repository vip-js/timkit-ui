<script setup lang="ts">
import { computed } from 'vue';
import { AlertCircleIcon, PaperclipIcon, UploadIcon, XIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { formatBytes, useFileUpload } from '@/registry/default/hooks/use-file-upload-vue';

const initialFiles = [
  {
    name: 'document.pdf',
    size: 1528737,
    type: 'application/pdf',
    url: 'https://picsum.photos/1000/800?grayscale&random=1',
    id: 'document.pdf-1744638436563-8u5xuls',
  },
];

const maxSize = 10 * 1024 * 1024;

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
  maxSize,
  initialFiles,
});

const file = computed(() => files.value[0] ?? null);

function removeCurrentFile() {
  const fileId = files.value[0]?.id;
  if (fileId) {
    removeFile(fileId);
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      role="button"
      @click="openFileDialog"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @dragover="handleDragOver"
      @drop="handleDrop"
      :data-dragging="isDragging || undefined"
      class="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
    >
      <input
        v-bind="getInputProps()"
        class="sr-only"
        aria-label="Upload file"
        :disabled="Boolean(file)"
      />

      <div class="flex flex-col items-center justify-center text-center">
        <div class="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
          <UploadIcon class="size-4 opacity-60" />
        </div>
        <p class="mb-1.5 text-sm font-medium">Upload file</p>
        <p class="text-muted-foreground text-xs">Drag & drop or click to browse (max. {{ formatBytes(maxSize) }})</p>
      </div>
    </div>

    <div v-if="errors.length > 0" class="text-destructive flex items-center gap-1 text-xs" role="alert">
      <AlertCircleIcon class="size-3 shrink-0" />
      <span>{{ errors[0] }}</span>
    </div>

    <div v-if="file" class="space-y-2">
      <div :key="file.id" class="flex items-center justify-between gap-2 rounded-xl border px-4 py-2">
        <div class="flex items-center gap-3 overflow-hidden">
          <PaperclipIcon class="size-4 shrink-0 opacity-60" aria-hidden="true" />
          <div class="min-w-0">
            <p class="truncate text-[13px] font-medium">{{ file.file.name }}</p>
          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          class="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
          @click="removeCurrentFile"
          aria-label="Remove file"
        >
          <XIcon class="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>

    <p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-center text-xs">
      Single file uploader w/ max size ∙
      <a
        href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md"
        class="hover:text-foreground underline"
      >
        API
      </a>
    </p>
  </div>
</template>

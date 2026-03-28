<script setup lang="ts">
import { computed } from 'vue';
import { CircleUserRoundIcon, XIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { useFileUpload } from '@/registry/default/hooks/use-file-upload-vue';

const [
  { files, isDragging },
  {
    removeFile,
    openFileDialog,
    getInputProps,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  },
] = useFileUpload({
  accept: 'image/*',
});

const previewUrl = computed(() => files.value[0]?.preview ?? null);

function removeCurrentFile() {
  const fileId = files.value[0]?.id;
  if (fileId) {
    removeFile(fileId);
  }
}
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
        :aria-label="previewUrl ? 'Change image' : 'Upload image'"
      >
        <template v-if="previewUrl">
          <img
            class="size-full object-cover"
            :src="previewUrl"
            :alt="files[0]?.file?.name || 'Uploaded image'"
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
        v-if="previewUrl"
        @click="removeCurrentFile"
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
    <p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-xs">
      Avatar uploader with droppable area ∙
      <a
        href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md"
        class="hover:text-foreground underline"
      >
        API
      </a>
    </p>
  </div>
</template>

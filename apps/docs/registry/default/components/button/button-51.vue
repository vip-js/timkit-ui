<script setup lang="ts">
import { computed } from 'vue';
import { CircleUserRoundIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { useFileUpload } from '@/registry/default/hooks/use-file-upload-vue';

const [{ files }, { removeFile, openFileDialog, getInputProps }] = useFileUpload({
  accept: 'image/*',
});

const previewUrl = computed(() => files.value[0]?.preview ?? null);
const fileName = computed(() => files.value[0]?.file.name ?? null);

function removeCurrentFile() {
  const fileId = files.value[0]?.id;
  if (fileId) {
    removeFile(fileId);
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <div class="inline-flex items-center gap-2 align-top">
      <div
        class="border-input relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border"
        :aria-label="previewUrl ? 'Preview of uploaded image' : 'Default user avatar'"
      >
        <template v-if="previewUrl">
          <img
            class="size-full object-cover"
            :src="previewUrl"
            alt="Preview of uploaded image"
            :width="32"
            :height="32"
          />
        </template>
        <template v-else>
          <div aria-hidden="true">
            <CircleUserRoundIcon class="opacity-60" :size="16" />
          </div>
        </template>
      </div>
      <div class="relative inline-block">
        <Button @click="openFileDialog" aria-haspopup="dialog">
          {{ fileName ? 'Change image' : 'Upload image' }}
        </Button>
        <input
          v-bind="getInputProps()"
          class="sr-only"
          aria-label="Upload image file"
          :tabIndex="-1"
        />
      </div>
    </div>
    <div v-if="fileName" class="inline-flex gap-2 text-xs">
      <p class="text-muted-foreground truncate" aria-live="polite">{{ fileName }}</p>
      <button
        @click="removeCurrentFile"
        class="text-destructive font-medium hover:underline"
        :aria-label="`Remove ${fileName}`"
      >
        Remove
      </button>
    </div>
    <p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-xs">
      Basic image uploader ∙
      <a
        href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md"
        class="hover:text-foreground underline"
      >
        Docs
      </a>
    </p>
  </div>
</template>

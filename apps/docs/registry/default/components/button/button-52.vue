<script setup lang="ts">
import { computed } from 'vue';
import { CircleUserRoundIcon, XIcon } from 'lucide-vue-next';
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
    <div class="relative inline-flex">
      <Button
        variant="outline"
        class="relative size-16 overflow-hidden p-0 shadow-none"
        @click="openFileDialog"
        :aria-label="previewUrl ? 'Change image' : 'Upload image'"
      >
        <template v-if="previewUrl">
          <img
            class="size-full object-cover"
            :src="previewUrl"
            alt="Preview of uploaded image"
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
      </Button>
      <Button
        v-if="previewUrl"
        @click="removeCurrentFile"
        size="icon"
        class="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
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
    <p v-if="fileName" class="text-muted-foreground text-xs">{{ fileName }}</p>
    <p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-xs">Avatar upload button</p>
  </div>
</template>

<script setup lang="ts">
import { CircleUserRoundIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/registry/default/hooks/use-file-upload.vue';


</script>

<template>
  <div class="flex flex-col items-center gap-2"><div class="inline-flex items-center gap-2 align-top"><div class="border-input relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border" :aria-label="previewUrl ? 'Preview of uploaded image' : 'Default user avatar'">{{ previewUrl ? (
            <img
              className="size-full object-cover"
              src={previewUrl}
              alt="Preview of uploaded image"
              width={32}
              height={32}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="opacity-60" size={16} />
            </div>
          ) }}</div><div class="relative inline-block"><Button @click="openFileDialog" aria-haspopup="dialog">{{ fileName ? 'Change image' : 'Upload image' }}</Button><input class="sr-only" aria-label="Upload image file" :tabIndex="-1" /></div></div><div v-if="fileName" class="inline-flex gap-2 text-xs"><p class="text-muted-foreground truncate" aria-live="polite">{{ fileName }}</p>{{ ' ' }}<button @click="removeFile(files[0]?.id)" class="text-destructive font-medium hover:underline" :aria-label="`Remove ${fileName}`">Remove
          </button></div><p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-xs">Basic image uploader ∙{{ ' ' }}<a href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md" class="hover:text-foreground underline">Docs
        </a></p></div>
</template>

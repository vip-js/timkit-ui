<script setup lang="ts">
import { AlertCircleIcon, FileArchiveIcon, FileIcon, FileSpreadsheetIcon, FileTextIcon, HeadphonesIcon, ImageIcon, Trash2Icon, UploadIcon, VideoIcon, XIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { formatBytes, useFileUpload } from '@/registry/default/hooks/use-file-upload.vue';


</script>

<template>
  <div class="flex flex-col gap-2"><div :onDragEnter="handleDragEnter" :onDragLeave="handleDragLeave" :onDragOver="handleDragOver" :onDrop="handleDrop" :data-dragging="isDragging || undefined" :data-files="files.length > 0 || undefined" class="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"><input class="sr-only" aria-label="Upload image file" />{{ files.length > 0 ? (
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-medium">Files ({files.length})</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={openFileDialog}>
                  <UploadIcon className="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />
                  Add files
                </Button>
                <Button variant="outline" size="sm" onClick={clearFiles}>
                  <Trash2Icon className="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />
                  Remove all
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="bg-background relative flex flex-col rounded-md border"
                >
                  {getFilePreview(file)}
                  <Button
                    onClick={() => removeFile(file.id)}
                    size="icon"
                    className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                    aria-label="Remove image"
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                  <div className="flex min-w-0 flex-col gap-0.5 border-t p-3">
                    <p className="truncate text-[13px] font-medium">{file.file.name}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {formatBytes(file.file.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <ImageIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">Drop your files here</p>
            <p className="text-muted-foreground text-xs">
              Max {maxFiles} files ∙ Up to {maxSizeMB}MB
            </p>
            <Button variant="outline" className="mt-4" onClick={openFileDialog}>
              <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
              Select images
            </Button>
          </div>
        ) }}</div><div v-if="errors.length > 0" class="text-destructive flex items-center gap-1 text-xs" role="alert"><AlertCircleIcon class="size-3 shrink-0" /><span>{{ errors[0] }}</span></div><p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-center text-xs">Mixed content w/ card ∙{{ ' ' }}<a href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md" class="hover:text-foreground underline">API
        </a></p></div>
</template>

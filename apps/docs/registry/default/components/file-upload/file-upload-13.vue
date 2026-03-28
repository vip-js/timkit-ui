<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import {
  AlertCircleIcon,
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  Trash2Icon,
  UploadIcon,
  VideoIcon,
  XIcon,
} from 'lucide-vue-next'
import { Button } from '@timui/vue'

type UploadFile = {
  id: string
  name: string
  size: number
  type: string
  url?: string
  file?: File
  preview?: string
}

type UploadProgress = {
  progress: number
  completed: boolean
}

const maxSizeMB = 5
const maxSize = maxSizeMB * 1024 * 1024
const maxFiles = 6

const inputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const errors = ref<string[]>([])

const files = ref<UploadFile[]>([
  {
    id: 'intro.zip-1744638436563-8u5xuls',
    name: 'intro.zip',
    size: 252873,
    type: 'application/zip',
    url: 'https://example.com/intro.zip',
  },
  {
    id: 'image-01-123456789',
    name: 'image-01.jpg',
    size: 1528737,
    type: 'image/jpeg',
    url: 'https://picsum.photos/1000/800?grayscale&random=1',
  },
  {
    id: 'audio-123456789',
    name: 'audio.mp3',
    size: 1528737,
    type: 'audio/mpeg',
    url: 'https://example.com/audio.mp3',
  },
])

const progressMap = reactive<Record<string, UploadProgress>>({})
const uploadTimers = new Map<string, number>()

function randomId(file: File) {
  return `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

function getFileIcon(file: UploadFile) {
  const fileType = file.type
  const fileName = file.name.toLowerCase()

  if (
    fileType.includes('pdf') ||
    fileType.includes('word') ||
    fileName.endsWith('.pdf') ||
    fileName.endsWith('.doc') ||
    fileName.endsWith('.docx')
  ) {
    return FileTextIcon
  }

  if (
    fileType.includes('zip') ||
    fileType.includes('archive') ||
    fileName.endsWith('.zip') ||
    fileName.endsWith('.rar')
  ) {
    return FileArchiveIcon
  }

  if (
    fileType.includes('excel') ||
    fileName.endsWith('.xls') ||
    fileName.endsWith('.xlsx')
  ) {
    return FileSpreadsheetIcon
  }

  if (fileType.includes('video/')) {
    return VideoIcon
  }

  if (fileType.includes('audio/')) {
    return HeadphonesIcon
  }

  if (fileType.startsWith('image/')) {
    return ImageIcon
  }

  return FileIcon
}

function clearError() {
  errors.value = []
}

function stopUpload(id: string) {
  const timer = uploadTimers.get(id)
  if (timer) {
    window.clearInterval(timer)
    uploadTimers.delete(id)
  }
}

function startUpload(fileId: string, fileSize: number) {
  stopUpload(fileId)

  progressMap[fileId] = {
    progress: 0,
    completed: false,
  }

  let uploadedBytes = 0
  const timer = window.setInterval(() => {
    const chunkSize = Math.floor(Math.random() * 300000) + 2000
    uploadedBytes = Math.min(fileSize, uploadedBytes + chunkSize)

    const progress = Math.floor((uploadedBytes / fileSize) * 100)
    progressMap[fileId].progress = progress

    if (progress >= 100) {
      progressMap[fileId].completed = true
      stopUpload(fileId)
    }
  }, 120)

  uploadTimers.set(fileId, timer)
}

function appendFiles(nextFiles: File[]) {
  clearError()

  if (!nextFiles.length) {
    return
  }

  if (files.value.length + nextFiles.length > maxFiles) {
    errors.value = [`You can only upload up to ${maxFiles} files.`]
    return
  }

  const validFiles: UploadFile[] = []

  nextFiles.forEach((file) => {
    if (file.size > maxSize) {
      errors.value = [
        `File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`,
      ]
      return
    }

    const id = randomId(file)

    validFiles.push({
      id,
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    })
  })

  if (!validFiles.length) {
    return
  }

  files.value = [...files.value, ...validFiles]

  validFiles.forEach((file) => {
    startUpload(file.id, file.size)
  })

  if (inputRef.value) {
    inputRef.value.value = ''
  }
}

function removeFile(fileId: string) {
  const target = files.value.find((file) => file.id === fileId)

  if (target?.preview) {
    URL.revokeObjectURL(target.preview)
  }

  stopUpload(fileId)
  delete progressMap[fileId]
  files.value = files.value.filter((file) => file.id !== fileId)
}

function clearFiles() {
  files.value.forEach((file) => {
    if (file.preview) {
      URL.revokeObjectURL(file.preview)
    }
    stopUpload(file.id)
    delete progressMap[file.id]
  })

  files.value = []
  clearError()

  if (inputRef.value) {
    inputRef.value.value = ''
  }
}

function openFileDialog() {
  inputRef.value?.click()
}

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files) return
  appendFiles(Array.from(target.files))
}

function handleDragEnter(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
  isDragging.value = true
}

function handleDragLeave(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()

  const currentTarget = event.currentTarget as HTMLElement
  if (currentTarget.contains(event.relatedTarget as Node)) {
    return
  }

  isDragging.value = false
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
  isDragging.value = false

  if (!event.dataTransfer?.files?.length) {
    return
  }

  appendFiles(Array.from(event.dataTransfer.files))
}

const fileCount = computed(() => files.value.length)

onBeforeUnmount(() => {
  clearFiles()
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      :data-dragging="isDragging || undefined"
      :data-files="fileCount > 0 || undefined"
      class="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @dragover="handleDragOver"
      @drop="handleDrop"
    >
      <input
        ref="inputRef"
        class="sr-only"
        type="file"
        multiple
        :accept="'*'"
        aria-label="Upload file"
        @change="handleInputChange"
      />

      <template v-if="fileCount > 0">
        <div class="flex w-full flex-col gap-3">
          <div class="flex items-center justify-between gap-2">
            <h3 class="truncate text-sm font-medium">Files ({{ fileCount }})</h3>
            <div class="flex gap-2">
              <Button variant="outline" size="sm" @click="openFileDialog">
                <UploadIcon class="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />
                Add files
              </Button>
              <Button variant="outline" size="sm" @click="clearFiles">
                <Trash2Icon class="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />
                Remove all
              </Button>
            </div>
          </div>

          <div class="w-full space-y-2">
            <div
              v-for="file in files"
              :key="file.id"
              :data-uploading="progressMap[file.id] && !progressMap[file.id].completed ? true : undefined"
              class="bg-background flex flex-col gap-1 rounded-lg border p-2 pe-3 transition-opacity duration-300"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-3 overflow-hidden in-data-[uploading=true]:opacity-50">
                  <div class="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                    <component :is="getFileIcon(file)" class="size-5 opacity-60" />
                  </div>
                  <div class="flex min-w-0 flex-col gap-0.5">
                    <p class="truncate text-[13px] font-medium">{{ file.name }}</p>
                    <p class="text-muted-foreground text-xs">{{ formatBytes(file.size) }}</p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  class="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                  aria-label="Remove file"
                  @click="removeFile(file.id)"
                >
                  <XIcon class="size-4" aria-hidden="true" />
                </Button>
              </div>

              <div
                v-if="progressMap[file.id] && !progressMap[file.id].completed"
                class="mt-1 flex items-center gap-2"
              >
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    class="bg-primary h-full transition-all duration-300 ease-out"
                    :style="{ width: `${progressMap[file.id].progress}%` }"
                  />
                </div>
                <span class="text-muted-foreground w-10 text-xs tabular-nums">
                  {{ progressMap[file.id].progress }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="flex flex-col items-center justify-center px-4 py-3 text-center">
          <div
            class="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <ImageIcon class="size-4 opacity-60" />
          </div>
          <p class="mb-1.5 text-sm font-medium">Drop your files here</p>
          <p class="text-muted-foreground text-xs">
            Max {{ maxFiles }} files ∙ Up to {{ maxSizeMB }}MB
          </p>
          <Button variant="outline" class="mt-4" @click="openFileDialog">
            <UploadIcon class="-ms-1 opacity-60" aria-hidden="true" />
            Select files
          </Button>
        </div>
      </template>
    </div>

    <div v-if="errors.length > 0" class="text-destructive flex items-center gap-1 text-xs" role="alert">
      <AlertCircleIcon class="size-3 shrink-0" />
      <span>{{ errors[0] }}</span>
    </div>

    <p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-center text-xs">
      With simulated progress track ∙
      <a
        href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md"
        class="hover:text-foreground underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        API
      </a>
    </p>
  </div>
</template>

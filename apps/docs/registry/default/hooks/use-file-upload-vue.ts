import { ref } from 'vue'

export type FileMetadata = {
  name: string
  size: number
  type: string
  url: string
  id: string
}

export type FileWithPreview = {
  file: File | FileMetadata
  id: string
  preview?: string
}

type FileUploadOptions = {
  maxFiles?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  initialFiles?: FileMetadata[]
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

function isAccepted(file: File, accept: string) {
  if (accept === '*' || !accept.trim()) return true

  const acceptedTypes = accept.split(',').map((type) => type.trim())
  const fileType = file.type || ''
  const extension = `.${file.name.split('.').pop() ?? ''}`.toLowerCase()

  return acceptedTypes.some((type) => {
    if (type.startsWith('.')) return extension === type.toLowerCase()
    if (type.endsWith('/*')) return fileType.startsWith(`${type.split('/')[0]}/`)
    return fileType === type
  })
}

export function useFileUpload(options: FileUploadOptions = {}) {
  const {
    maxFiles = Number.POSITIVE_INFINITY,
    maxSize = Number.POSITIVE_INFINITY,
    accept = '*',
    multiple = false,
    initialFiles = [],
  } = options

  const files = ref<FileWithPreview[]>(
    initialFiles.map((item) => ({
      file: item,
      id: item.id,
      preview: item.url,
    }))
  )
  const isDragging = ref(false)
  const errors = ref<string[]>([])
  const inputRef = ref<HTMLInputElement | null>(null)

  function clearErrors() {
    errors.value = []
  }

  function addFiles(nextFiles: FileList | File[]) {
    const incoming = Array.from(nextFiles)
    if (!incoming.length) return

    clearErrors()

    if (!multiple) {
      clearFiles()
    }

    if (multiple && files.value.length + incoming.length > maxFiles) {
      errors.value = [`You can only upload a maximum of ${maxFiles} files.`]
      return
    }

    const validFiles: FileWithPreview[] = []

    for (const file of incoming) {
      if (file.size > maxSize) {
        errors.value = [`File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`]
        continue
      }

      if (!isAccepted(file, accept)) {
        errors.value = [`File "${file.name}" is not an accepted file type.`]
        continue
      }

      if (multiple) {
        const duplicated = files.value.some(
          (existing) => existing.file.name === file.name && existing.file.size === file.size
        )
        if (duplicated) continue
      }

      validFiles.push({
        file,
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      })
    }

    if (!validFiles.length) return
    files.value = multiple ? [...files.value, ...validFiles] : validFiles
  }

  function removeFile(id: string) {
    const target = files.value.find((item) => item.id === id)
    if (target?.preview && target.file instanceof File) {
      URL.revokeObjectURL(target.preview)
    }
    files.value = files.value.filter((item) => item.id !== id)
    clearErrors()
  }

  function clearFiles() {
    files.value.forEach((item) => {
      if (item.preview && item.file instanceof File) {
        URL.revokeObjectURL(item.preview)
      }
    })
    files.value = []
    clearErrors()
    if (inputRef.value) {
      inputRef.value.value = ''
    }
  }

  function handleDragEnter(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    isDragging.value = true
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()

    const currentTarget = event.currentTarget as HTMLElement | null
    const relatedTarget = event.relatedTarget as Node | null
    if (currentTarget && relatedTarget && currentTarget.contains(relatedTarget)) {
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

    if (!event.dataTransfer?.files?.length) return
    if (!multiple) {
      addFiles([event.dataTransfer.files[0]])
      return
    }
    addFiles(event.dataTransfer.files)
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    if (!target.files?.length) return
    addFiles(target.files)
    target.value = ''
  }

  function openFileDialog() {
    if (inputRef.value) {
      inputRef.value.click()
      return
    }

    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = multiple
    input.accept = accept
    input.onchange = (event) => handleFileChange(event as Event)
    input.click()
  }

  function getInputProps() {
    return {
      ref: inputRef,
      type: 'file',
      multiple,
      accept,
      onChange: handleFileChange,
    }
  }

  return [
    { files, isDragging, errors },
    {
      addFiles,
      removeFile,
      clearFiles,
      clearErrors,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      handleFileChange,
      openFileDialog,
      getInputProps,
    },
  ] as const
}

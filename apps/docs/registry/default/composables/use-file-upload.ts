import { ref, type Ref } from 'vue'

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

export type FileUploadOptions = {
  maxFiles?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  initialFiles?: FileMetadata[]
  onFilesChange?: (files: FileWithPreview[]) => void
  onFilesAdded?: (addedFiles: FileWithPreview[]) => void
}

export type FileUploadState = {
  files: Ref<FileWithPreview[]>
  isDragging: Ref<boolean>
  errors: Ref<string[]>
}

export type FileUploadActions = {
  addFiles: (files: FileList | File[]) => void
  removeFile: (id: string) => void
  clearFiles: () => void
  clearErrors: () => void
  handleDragEnter: (e: DragEvent) => void
  handleDragLeave: (e: DragEvent) => void
  handleDragOver: (e: DragEvent) => void
  handleDrop: (e: DragEvent) => void
  handleFileChange: (e: Event) => void
  openFileDialog: () => void
  inputRef: Ref<HTMLInputElement | null>
}

export function useFileUpload(
  options: FileUploadOptions = {}
): [FileUploadState, FileUploadActions] {
  const {
    maxFiles = Number.POSITIVE_INFINITY,
    maxSize = Number.POSITIVE_INFINITY,
    accept = '*',
    multiple = false,
    initialFiles = [],
    onFilesChange,
    onFilesAdded,
  } = options

  const files = ref<FileWithPreview[]>(
    initialFiles.map((file) => ({
      file,
      id: file.id,
      preview: file.url,
    }))
  )
  const isDragging = ref(false)
  const errors = ref<string[]>([])
  const inputRef = ref<HTMLInputElement | null>(null)

  const validateFile = (file: File | FileMetadata): string | null => {
    if (file.size > maxSize) {
      return `File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`
    }

    if (accept !== '*') {
      const acceptedTypes = accept.split(',').map((type) => type.trim())
      const fileType = file instanceof File ? file.type || '' : file.type
      const fileExtension = `.${file.name.split('.').pop()}`

      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith('.')) {
          return fileExtension.toLowerCase() === type.toLowerCase()
        }
        if (type.endsWith('/*')) {
          const baseType = type.split('/')[0]
          return fileType.startsWith(`${baseType}/`)
        }
        return fileType === type
      })

      if (!isAccepted) {
        return `File "${file.name}" is not an accepted file type.`
      }
    }

    return null
  }

  const createPreview = (file: File | FileMetadata): string | undefined => {
    if (file instanceof File) {
      return URL.createObjectURL(file)
    }
    return file.url
  }

  const generateUniqueId = (file: File | FileMetadata): string => {
    if (file instanceof File) {
      return `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }
    return file.id
  }

  const clearFiles = () => {
    files.value.forEach((file) => {
      if (file.preview && file.file instanceof File && file.file.type.startsWith('image/')) {
        URL.revokeObjectURL(file.preview)
      }
    })

    if (inputRef.value) {
      inputRef.value.value = ''
    }

    files.value = []
    errors.value = []

    onFilesChange?.(files.value)
  }

  const addFiles = (newFiles: FileList | File[]) => {
    if (!newFiles || newFiles.length === 0) return

    const newFilesArray = Array.from(newFiles)
    const newErrors: string[] = []

    errors.value = []

    if (!multiple) {
      clearFiles()
    }

    if (
      multiple &&
      maxFiles !== Number.POSITIVE_INFINITY &&
      files.value.length + newFilesArray.length > maxFiles
    ) {
      newErrors.push(`You can only upload a maximum of ${maxFiles} files.`)
      errors.value = newErrors
      return
    }

    const validFiles: FileWithPreview[] = []

    newFilesArray.forEach((file) => {
      if (multiple) {
        const isDuplicate = files.value.some(
          (existingFile) =>
            existingFile.file.name === file.name && existingFile.file.size === file.size
        )

        if (isDuplicate) return
      }

      if (file.size > maxSize) {
        newErrors.push(
          multiple
            ? `Some files exceed the maximum size of ${formatBytes(maxSize)}.`
            : `File exceeds the maximum size of ${formatBytes(maxSize)}.`
        )
        return
      }

      const error = validateFile(file)
      if (error) {
        newErrors.push(error)
      } else {
        validFiles.push({
          file,
          id: generateUniqueId(file),
          preview: createPreview(file),
        })
      }
    })

    if (validFiles.length > 0) {
      onFilesAdded?.(validFiles)

      const updatedFiles = !multiple ? validFiles : [...files.value, ...validFiles]
      files.value = updatedFiles
      errors.value = newErrors
      onFilesChange?.(updatedFiles)
    } else if (newErrors.length > 0) {
      errors.value = newErrors
    }

    if (inputRef.value) {
      inputRef.value.value = ''
    }
  }

  const removeFile = (id: string) => {
    const fileToRemove = files.value.find((f) => f.id === id)
    if (
      fileToRemove &&
      fileToRemove.preview &&
      fileToRemove.file instanceof File &&
      fileToRemove.file.type.startsWith('image/')
    ) {
      URL.revokeObjectURL(fileToRemove.preview)
    }

    files.value = files.value.filter((file) => file.id !== id)
    errors.value = []
    onFilesChange?.(files.value)
  }

  const clearErrors = () => {
    errors.value = []
  }

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    isDragging.value = true
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.currentTarget && (e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
      return
    }

    isDragging.value = false
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    isDragging.value = false

    if (inputRef.value?.disabled) {
      return
    }

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      if (!multiple) {
        addFiles([e.dataTransfer.files[0]])
      } else {
        addFiles(e.dataTransfer.files)
      }
    }
  }

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      addFiles(target.files)
    }
  }

  const openFileDialog = () => {
    if (inputRef.value) {
      inputRef.value.click()
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
      inputRef,
    },
  ]
}

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i]
}

type ComponentDataValue =
  | string
  | number
  | boolean
  | undefined
  | ComponentDataValue[]
  | { [key: string]: ComponentDataValue }

type ClassValue = ComponentDataValue | null | false

function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}

function resolveClasses(...classes: ClassValue[]): string {
  return cn(...classes)
}

type BaseVariantOptions = { className?: ComponentDataValue }
type ButtonVariantOptions = {
  variant?: ComponentDataValue
  size?: ComponentDataValue
  className?: ComponentDataValue
}
type SheetContentVariantOptions = {
  side?: ComponentDataValue
  className?: ComponentDataValue
}

function avatarVariants(options?: BaseVariantOptions): string {
  return cn(options?.className)
}

function bannerVariants(options?: BaseVariantOptions): string {
  return cn(options?.className)
}

function buttonVariants(options?: ButtonVariantOptions): string {
  return cn(options?.className)
}

function cardVariants(options?: BaseVariantOptions): string {
  return cn(options?.className)
}

function checkboxVariants(options?: BaseVariantOptions): string {
  return cn(options?.className)
}

function labelVariants(options?: BaseVariantOptions): string {
  return cn(options?.className)
}

function radioGroupVariants(options?: BaseVariantOptions): string {
  return cn(options?.className)
}

function textareaVariants(options?: BaseVariantOptions): string {
  return cn(options?.className)
}

function switchVariants(options?: BaseVariantOptions): string {
  return cn(options?.className)
}

function switchThumbVariants(): string {
  return ''
}

function sliderRootVariants(options?: BaseVariantOptions): string {
  return cn(options?.className)
}

function sliderTrackVariants(): string {
  return ''
}

function sliderRangeVariants(): string {
  return ''
}

function sliderThumbVariants(): string {
  return ''
}

function dialogContentVariants(options?: BaseVariantOptions): string {
  return cn(options?.className)
}

function dialogOverlayVariants(options?: BaseVariantOptions): string {
  return cn(options?.className)
}

function dialogCloseVariants(options?: BaseVariantOptions): string {
  return cn(options?.className)
}

function sheetContentVariants(options?: SheetContentVariantOptions): string {
  return cn(options?.className)
}

function sheetOverlayVariants(options?: BaseVariantOptions): string {
  return cn(options?.className)
}

export {
  avatarVariants,
  bannerVariants,
  buttonVariants,
  cardVariants,
  checkboxVariants,
  cn,
  dialogCloseVariants,
  dialogContentVariants,
  dialogOverlayVariants,
  labelVariants,
  radioGroupVariants,
  resolveClasses,
  sheetContentVariants,
  sheetOverlayVariants,
  sliderRangeVariants,
  sliderRootVariants,
  sliderThumbVariants,
  sliderTrackVariants,
  switchThumbVariants,
  switchVariants,
  textareaVariants,
}

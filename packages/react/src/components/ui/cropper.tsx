'use client'
'use client'

import { Cropper as CropperPrimitive } from '@origin-space/image-cropper'
import {
  cn,
  cropperCropAreaVariants,
  cropperDescriptionVariants,
  cropperImageVariants,
  cropperRootVariants,
} from '@timui/core'

function Cropper({ className, ...props }: React.ComponentProps<typeof CropperPrimitive.Root>) {
  return (
    <CropperPrimitive.Root
      data-slot="cropper"
      className={cn(cropperRootVariants(), className)}
      {...props}
    />
  )
}

function CropperDescription({
  className,
  ...props
}: React.ComponentProps<typeof CropperPrimitive.Description>) {
  return (
    <CropperPrimitive.Description
      data-slot="cropper-description"
      className={cn(cropperDescriptionVariants(), className)}
      {...props}
    />
  )
}

function CropperImage({
  className,
  ...props
}: React.ComponentProps<typeof CropperPrimitive.Image>) {
  return (
    <CropperPrimitive.Image
      data-slot="cropper-image"
      className={cn(cropperImageVariants(), className)}
      {...props}
    />
  )
}

function CropperCropArea({
  className,
  ...props
}: React.ComponentProps<typeof CropperPrimitive.CropArea>) {
  return (
    <CropperPrimitive.CropArea
      data-slot="cropper-crop-area"
      className={cn(cropperCropAreaVariants(), className)}
      {...props}
    />
  )
}

export { Cropper, CropperDescription, CropperImage, CropperCropArea }

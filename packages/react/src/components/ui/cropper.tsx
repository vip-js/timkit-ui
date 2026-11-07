'use client'

import * as React from 'react'
import { Cropper as CropperPrimitive } from '@origin-space/image-cropper'
import {
  cn,
  cropperCropAreaVariants,
  cropperDescriptionVariants,
  cropperImageVariants,
  cropperRootVariants,
} from '@timui/core'

function blockCropEvent(event: React.SyntheticEvent) {
  event.preventDefault()
  event.stopPropagation()
}

function Cropper({
  className,
  disabled = false,
  aspect,
  aspectRatio,
  ...props
}: React.ComponentProps<typeof CropperPrimitive.Root> & { disabled?: boolean; aspect?: number }) {
  const raw = aspectRatio ?? aspect
  const ratio = typeof raw === 'number' && Number.isFinite(raw) && raw > 0 ? raw : 0
  return (
    <div
      data-slot="cropper-frame"
      data-disabled={disabled ? '' : undefined}
      aria-disabled={disabled || undefined}
      onMouseDownCapture={disabled ? blockCropEvent : undefined}
      onPointerDownCapture={disabled ? blockCropEvent : undefined}
      onWheelCapture={disabled ? blockCropEvent : undefined}
      onKeyDownCapture={disabled ? blockCropEvent : undefined}
    >
      {ratio ? <p role="status">{`${ratio} to 1`}</p> : null}
      <CropperPrimitive.Root
        data-slot="cropper"
        className={cn(cropperRootVariants(), className)}
        aspectRatio={aspectRatio ?? aspect}
        {...props}
      />
    </div>
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

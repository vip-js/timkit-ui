import { cva } from 'class-variance-authority'

export const imageCropperVariants = cva('')
export const cropperRootVariants = cva(
  'relative flex w-full cursor-move touch-none items-center justify-center overflow-hidden focus:outline-none'
)
export const cropperDescriptionVariants = cva('sr-only')
export const cropperImageVariants = cva('pointer-events-none h-full w-full object-cover')
export const cropperCropAreaVariants = cva(
  'pointer-events-none absolute border-3 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.3)] in-[[data-slot=cropper]:focus-visible]:ring-[3px] in-[[data-slot=cropper]:focus-visible]:ring-white/50'
)

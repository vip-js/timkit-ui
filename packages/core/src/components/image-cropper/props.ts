export interface Crop {
  x: number
  y: number
  width: number
  height: number
}

export type ImageCropperProps = {
  /**
   * The source URL of the image.
   */
  image?: string
  /**
   * The aspect ratio for the component or image cropper.
   */
  aspect?: number
  /**
   * Callback fired when the crop area or zoom changes.
   */
  onCropChange?: (crop: Crop) => void
}

export interface Crop {
    x: number
    y: number
    width: number
    height: number
}

export type ImageCropperProps = {
    image?: string
    aspect?: number
    onCropChange?: (crop: Crop) => void
}

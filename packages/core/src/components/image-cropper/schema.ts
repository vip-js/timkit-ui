import { defineUCS } from '../../shared'

const cropperSchema = defineUCS({
  name: 'image-cropper',
  title: 'Cropper',
  description: 'An image cropping component.',
  parts: [
    { name: 'root', description: 'The cropper container', isRoot: true },
    { name: 'description', description: 'The accessibility description' },
    { name: 'image', description: 'The image being cropped' },
    { name: 'cropArea', description: 'The selection area' },
  ],
  logic: {
    provider: 'none',
  },
  props: [],
  slots: [{ name: 'default', description: 'The cropper core components' }],
  supportedPlatforms: ['web'],
})

export default cropperSchema

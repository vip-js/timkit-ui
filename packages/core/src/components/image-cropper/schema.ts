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
  props: [
    {
      name: 'image',
      type: 'string',
      description: 'The source URL of the image.',
    },
    {
      name: 'aspect',
      type: 'number',
      description: 'Aspect ratio of the crop area.',
    },
    {
      name: 'onCropChange',
      type: 'event',
      description: 'Called when the crop area changes.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'When true, crop changes are ignored.',
      defaultValue: false,
    },
  ],
  slots: [{ name: 'default', description: 'The cropper core components' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default cropperSchema

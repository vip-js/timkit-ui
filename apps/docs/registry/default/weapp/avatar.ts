import { avatarVariants } from '../utils'

Component({
  properties: {
    extClass: { type: String, value: '' },
  },
  data: {
    className: '',
    loaded: false,
    error: false,
  },
  lifetimes: {
    attached() {
      this._syncClassName()
    },
  },
  relations: {
    '../avatar-image/index': {
      type: 'child',
      linked() {
        this._syncChildren()
      },
      linkChanged() {
        this._syncChildren()
      },
    },
    '../avatar-fallback/index': {
      type: 'child',
      linked() {
        this._syncChildren()
      },
      linkChanged() {
        this._syncChildren()
      },
    },
  },
  observers: {
    extClass() {
      this._syncClassName()
    },
  },
  methods: {
    _syncClassName() {
      this.setData({
        className: avatarVariants({ className: this.properties.extClass }),
      })
    },
    handleImageLoaded() {
      this.setData({ loaded: true, error: false })
      this._syncChildren()
    },
    handleImageError() {
      this.setData({ loaded: false, error: true })
      this._syncChildren()
    },
    _syncChildren() {
      const imageNodes = this.getRelationNodes('../avatar-image/index')
      const fallbackNodes = this.getRelationNodes('../avatar-fallback/index')
      const { loaded, error } = this.data

      imageNodes.forEach((node: any) => {
        node.setData({ hidden: error })
      })
      fallbackNodes.forEach((node: any) => {
        node.setData({ hidden: loaded && !error })
      })
    },
  },
})

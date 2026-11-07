import {
  emitTimEvent,
  resolveClasses,
  toastCloseVariants,
  toastDescriptionVariants,
  toastTitleVariants,
  toastVariants,
} from '../utils'
import {
  createWeappBaseProps,
  createWeappOptions,
  WEAPP_EXTERNAL_CLASSES,
} from '../utils/component'
import { setupToastMachine } from './use-toast'

type MachineEvent =
  | string
  | {
      type: string
      [key: string]: string | number | boolean | string[] | number[] | null | undefined
    }

type ToastVariant = 'default' | 'destructive'
type ToastStatus = 'visible' | 'dismissing' | 'unmounted'

type WeappToastApi = {
  dismiss?: () => void
}

type WeappService = {
  setContext: (context: { type?: ToastVariant; duration?: number }) => void
}

type ToastStatusDetails = {
  status: ToastStatus
}

type WeappToastInternal =
  WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.IAnyObject> & {
    _service?: WeappService
    _cleanup?: () => void
    _send?: (event: MachineEvent) => void
    _connect?: (state: object, send: (event: MachineEvent) => void) => WeappToastApi
    data: {
      api: WeappToastApi
    }
    properties: {
      variant: string
      type: string
      duration: number
      title: string
      description: string
      showClose: boolean
      open: boolean
      id: string
      extClass: string
    }
  }

function toToastVariant(variant: string, type: string): ToastVariant {
  if (variant === 'destructive' || variant === 'default') return variant
  if (type === 'error' || type === 'destructive') return 'destructive'
  return 'default'
}

Component({
  options: createWeappOptions({ pureData: true }),

  externalClasses: WEAPP_EXTERNAL_CLASSES,

  properties: {
    variant: { type: String, value: '' },
    type: { type: String, value: '' },
    duration: { type: Number, value: 3000 },
    title: { type: String, value: '' },
    description: { type: String, value: '' },
    showClose: { type: Boolean, value: true },
    open: { type: null, value: null },
    ...createWeappBaseProps('toast'),
  },

  data: {
    api: {} as WeappToastApi,
    toastClass: '',
    open: true,
    titleClass: '',
    descriptionClass: '',
    closeClass: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappToastInternal
      const variant = toToastVariant(this.properties.variant, this.properties.type)
      const { service, start, send, connect } = setupToastMachine(this, {
        id: this.properties.id,
        type: variant === 'destructive' ? 'error' : 'info',
        duration: this.properties.duration,
        onStatusChange: (details: ToastStatusDetails) => {
          if (details.status === 'unmounted') {
            this.triggerEvent('close')
            emitTimEvent(
              this,
              'statuschange',
              'toast.statusChange',
              this.properties.id || 'toast',
              { status: details.status }
            )
          }
        },
      })

      self._service = service as WeappService
      self._send = send as (event: MachineEvent) => void
      self._connect = connect
      self._cleanup = start()
    },
    detached() {
      const self = this as WeappToastInternal
      self._cleanup?.()
    },
  },

  observers: {
    open(next: boolean) {
      const open = next !== false
      if (open === (this.data.open !== false)) return
      this.setData({ open })
    },
    state: function (state) {
      const self = this as WeappToastInternal
      if (!state || !self._send || !self._connect) return
      let api: WeappToastApi = {}
      try {
        api = self._connect(state, self._send) as WeappToastApi
      } catch {
        api = {}
      }

      const toastClass = resolveClasses(
        toastVariants({
          variant: toToastVariant(this.properties.variant, this.properties.type),
        }),
        self.properties.extClass
      )
      const titleClass = resolveClasses(toastTitleVariants())
      const descriptionClass = resolveClasses(toastDescriptionVariants())
      const closeClass = resolveClasses(toastCloseVariants())

      this.setData({
        api,
        toastClass,
        titleClass,
        descriptionClass,
        closeClass,
        open: this.properties.open !== false && this.data.open !== false,
      })
    },
  },

  methods: {
    onCloseKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onCloseTap()
    },
    onCloseTap() {
      const self = this as WeappToastInternal
      const controlled = this.properties.open !== null && this.properties.open !== undefined
      if (!controlled) this.setData({ open: false })
      this.triggerEvent('openchange', { open: false })
      self.data.api.dismiss?.()
    },
  },
})

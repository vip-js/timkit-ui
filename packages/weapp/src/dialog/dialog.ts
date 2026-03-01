import { dialogContentVariants, dialogOverlayVariants, dialogCloseVariants } from '@timui/core'
import { resolveClasses } from '../utils'
import { setupDialogMachine } from './use-dialog'

type MachineEvent = string | {
  type: string
  [key: string]: string | number | boolean | string[] | number[] | null | undefined
}

type WeappDialogApi = {
  open?: boolean
  backdropProps?: {
    onClick?: () => void
  }
  closeTriggerProps?: {
    onClick?: () => void
  }
}

type WeappService = {
  setContext: (context: {
    open?: boolean
  }) => void
}

type OpenChangeDetails = {
  open: boolean
}

type MachineSend = (event: MachineEvent) => void

type WeappDialogInternal = WechatMiniprogram.Component.InstanceMethods<WeappDialogApi> & {
  _service?: WeappService
  _cleanup?: () => void
  _send?: MachineSend
  _connect?: (state: object, send: MachineSend) => WeappDialogApi
  data: {
    api: WeappDialogApi
  }
  properties: {
    open: boolean
    id: string
    extClass: string
  }
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  properties: {
    open: {
      type: Boolean,
      value: false,
    },
    id: {
      type: String,
      value: 'dialog',
    },
    extClass: {
      type: String,
      value: '',
    },
  },

  data: {
    api: {} as WeappDialogApi,
    // Store variants class strings
    contentClass: '',
    overlayClass: '',
    closeClass: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappDialogInternal
      const { controller, connect } = setupDialogMachine(this)

      self._service = controller.service as WeappService
      self._cleanup = controller.start()
      self._send = controller.send as MachineSend
      self._connect = connect
    },
    detached() {
      const self = this as WeappDialogInternal
      self._cleanup?.()
    },
  },

  observers: {
    'state': function (state) {
      const self = this as WeappDialogInternal
      if (!state || !self._send || !self._connect) return

      const api = self._connect(state, self._send) as WeappDialogApi

      const contentClass = resolveClasses(dialogContentVariants(), this.properties.extClass)
      const overlayClass = resolveClasses(dialogOverlayVariants())
      const closeClass = resolveClasses(dialogCloseVariants())

      this.setData({
        api,
        contentClass,
        overlayClass,
        closeClass
      })
    },

    'open': function (val) {
      const self = this as WeappDialogInternal
      if (self._service) {
        if (val !== self.data.api.open) {
          self._send?.(val ? 'OPEN' : 'CLOSE')
        }
      }
    },
  },

  methods: {
    emitVisibilityChange(open: boolean) {
      const details: OpenChangeDetails = { open }
      this.triggerEvent('change', details)
      if (!open) {
        this.triggerEvent('close')
      }
    },
    onBackdropTap() {
      const self = this as WeappDialogInternal
      self.data.api.backdropProps?.onClick?.()
      if (self.data.api.open) {
        this.emitVisibilityChange(false)
      }
    },
    onCloseTap() {
      const self = this as WeappDialogInternal
      self.data.api.closeTriggerProps?.onClick?.()
      if (self.data.api.open) {
        this.emitVisibilityChange(false)
      }
    },
    noop() { },
  }
})

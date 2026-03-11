import {
  alertDialogCancelVariants,
  buttonVariants,
  dialogCloseVariants,
  dialogContentVariants,
  dialogDescriptionVariants,
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogOverlayVariants,
  dialogTitleVariants,
} from '@timui/core'

import { resolveClasses } from '../utils'
import { setupAlertDialogMachine } from './use-alert-dialog'

type AlertDialogApi = {
  open?: boolean
  backdropProps?: { onClick?: () => void }
  closeTriggerProps?: { onClick?: () => void }
  contentProps?: Record<string, string>
  titleProps?: Record<string, string>
  descriptionProps?: Record<string, string>
}

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

type AlertDialogInstance = WechatMiniprogram.Component.InstanceMethods<AlertDialogApi> & {
  _service?: object
  _cleanup?: () => void
  _send?: MachineSend
  _connect?: (state: object, send: MachineSend) => AlertDialogApi
  data: {
    api: AlertDialogApi
  }
  properties: {
    id: string
    open: boolean
  }
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    id: { type: String, value: 'alert-dialog' },
    open: { type: Boolean, value: false },
    showTrigger: { type: Boolean, value: true },
    showClose: { type: Boolean, value: true },
    className: { type: String, value: '' },
    extClass: { type: String, value: '' },
    title: { type: String, value: '' },
    description: { type: String, value: '' },
    cancelText: { type: String, value: '' },
    confirmText: { type: String, value: '' },
  },

  data: {
    api: {} as AlertDialogApi,
    overlayClass: '',
    contentClass: '',
    titleClass: '',
    descriptionClass: '',
    footerClass: '',
    headerClass: '',
    cancelClass: '',
    confirmClass: '',
    closeClass: '',
  },

  lifetimes: {
    attached() {
      const self = this as AlertDialogInstance
      const { controller, connect } = setupAlertDialogMachine(this)

      self._service = controller.service
      self._cleanup = controller.start()
      self._send = controller.send as MachineSend
      self._connect = connect
    },
    detached() {
      const self = this as AlertDialogInstance
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as AlertDialogInstance
      if (!state || !self._send || !self._connect) return

      const api = self._connect(state, self._send) as AlertDialogApi

      const overlayClass = resolveClasses(dialogOverlayVariants())
      const contentClass = resolveClasses(dialogContentVariants(), this.properties.className)
      const titleClass = resolveClasses(dialogTitleVariants())
      const descriptionClass = resolveClasses(dialogDescriptionVariants())
      const footerClass = resolveClasses(dialogFooterVariants())
      const headerClass = resolveClasses(dialogHeaderVariants())
      const cancelClass = resolveClasses(alertDialogCancelVariants())
      const confirmClass = resolveClasses(buttonVariants())
      const closeClass = resolveClasses(dialogCloseVariants())

      this.setData({
        api,
        overlayClass,
        contentClass,
        titleClass,
        descriptionClass,
        footerClass,
        headerClass,
        cancelClass,
        confirmClass,
        closeClass,
      })
    },

    open: function (val) {
      const self = this as AlertDialogInstance
      if (self._service) {
        if (val !== self.data.api.open) {
          self._send?.(val ? 'OPEN' : 'CLOSE')
        }
      }
    },
  },

  methods: {
    onTriggerTap() {
      const self = this as AlertDialogInstance
      self._send?.('OPEN')
    },
    onBackdropTap() {
      const self = this as AlertDialogInstance
      self.data.api.backdropProps?.onClick?.()
    },
    onCloseTap() {
      const self = this as AlertDialogInstance
      self.data.api.closeTriggerProps?.onClick?.()
    },
    onCancelTap() {
      this.triggerEvent('cancel')
      const self = this as AlertDialogInstance
      self._send?.('CLOSE')
    },
    onConfirmTap() {
      this.triggerEvent('confirm')
      const self = this as AlertDialogInstance
      self._send?.('CLOSE')
    },
    noop() {},
  },
})

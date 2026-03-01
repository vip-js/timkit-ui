import { setupToastMachine } from './use-toast'
import { resolveClasses } from '../utils'
import { toastVariants, toastTitleVariants, toastDescriptionVariants, toastCloseVariants } from '../utils'

type MachineEvent = string | {
    type: string
    [key: string]: string | number | boolean | string[] | number[] | null | undefined
}

type ToastVariant = 'info' | 'success' | 'warning' | 'error'
type ToastStatus = 'visible' | 'dismissing' | 'unmounted'

type WeappToastApi = {
    dismiss?: () => void
}

type WeappService = {
    setContext: (context: {
        type?: ToastVariant
        duration?: number
    }) => void
}

type ToastStatusDetails = {
    status: ToastStatus
}

type WeappToastInternal = WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.IAnyObject> & {
    _service?: WeappService
    _cleanup?: () => void
    _send?: (event: MachineEvent) => void
    data: {
        api: WeappToastApi
    }
    properties: {
        type: string
        duration: number
        title: string
        description: string
        id: string
        extClass: string
    }
}

function toToastVariant(value: string): ToastVariant {
    if (value === 'success' || value === 'warning' || value === 'error') return value
    return 'info'
}

Component({
    options: {
        styleIsolation: 'apply-shared',
        pureDataPattern: /^_/,
    },

    properties: {
        type: { type: String, value: 'info' },
        duration: { type: Number, value: 3000 },
        title: { type: String, value: '' },
        description: { type: String, value: '' },
        id: { type: String, value: 'toast' },
        extClass: { type: String, value: '' },
    },

    data: {
        api: {} as WeappToastApi,
        toastClass: '',
        titleClass: '',
        descriptionClass: '',
        closeClass: '',
    },

    lifetimes: {
        attached() {
            const self = this as WeappToastInternal
            const variant = toToastVariant(this.properties.type)
            const { service, cleanup, send } = setupToastMachine(this, {
                id: this.properties.id,
                type: variant,
                duration: this.properties.duration,
                onStatusChange: (details: ToastStatusDetails) => {
                    if (details.status === 'unmounted') {
                        this.triggerEvent('close')
                    }
                }
            })

            self._service = service as WeappService
            self._cleanup = cleanup
            self._send = send as (event: MachineEvent) => void
        },
        detached() {
            const self = this as WeappToastInternal
            self._cleanup?.()
        },
    },

    observers: {
        'state': function (state) {
            const self = this as WeappToastInternal
            if (!state || !self._send) return
            const { connect } = setupToastMachine(this, { id: this.properties.id })
            const api = connect(state, self._send) as WeappToastApi

            const toastClass = resolveClasses(
                toastVariants({ variant: toToastVariant(this.properties.type) }),
                self.properties.extClass
            )
            const titleClass = resolveClasses(toastTitleVariants())
            const descriptionClass = resolveClasses(toastDescriptionVariants())
            const closeClass = resolveClasses(toastCloseVariants())

            this.setData({ api, toastClass, titleClass, descriptionClass, closeClass })
        },
    },

    methods: {
        onCloseTap() {
            const self = this as WeappToastInternal
            self.data.api.dismiss?.()
        },
    },
})

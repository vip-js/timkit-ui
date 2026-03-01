import type * as toast from '@zag-js/toast'
import type { LogicDefinition } from '../../shared'

export interface ToastAction {
    label: string
    onClick: () => void
}

export type ToastProps = toast.Options & {
    title?: string
    description?: string
    action?: ToastAction
}

/**
 * Toast Logic Definition契约
 */
export type ToastLogic = LogicDefinition<ToastProps, toast.Api>

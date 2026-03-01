'use client'

import * as React from 'react'
import { cva } from '../lib/cva'
import { cn } from '../lib/utils'
import * as switchZag from '@zag-js/switch'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'

const switchRootVariants = cva('inline-flex items-center')
const switchVariants = cva(
    'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input'
)
const switchThumbVariants = cva(
    'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
)

interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value' | 'defaultValue'> {
    checked?: boolean
    defaultChecked?: boolean
    required?: boolean
    disabled?: boolean
    name?: string
    value?: string
    id?: string
    onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    (
        {
            className,
            checked,
            defaultChecked,
            required,
            onCheckedChange,
            value = 'on',
            disabled,
            name,
            id,
            ...props
        },
        ref
    ) => {
        const generatedId = React.useId()
        const switchId = id ?? generatedId
        const service = useMachine(switchZag.machine, {
            id: switchId,
            checked,
            disabled,
            required,
            name,
            value,
            onCheckedChange(details) {
                onCheckedChange?.(details.checked)
            },
        })
        const api = switchZag.connect(service, normalizeProps)
        const rootProps = api.getRootProps()
        const controlProps = api.getControlProps()
        const thumbProps = api.getThumbProps()
        const hiddenInputProps = api.getHiddenInputProps()
        const mergedControlProps = mergeProps(controlProps, props)
        const { className: controlClassName, ...controlRest } = mergedControlProps

        return (
            <label
                {...rootProps}
                data-slot="switch-root"
                className={cn(switchRootVariants(), rootProps.className)}
            >
                <button
                    {...controlRest}
                    ref={ref}
                    type="button"
                    data-slot="switch"
                    className={cn(switchVariants(), controlClassName, className)}
                >
                    <span
                        {...thumbProps}
                        data-slot="switch-thumb"
                        className={cn(switchThumbVariants(), thumbProps.className)}
                    />
                </button>
                <input {...hiddenInputProps} />
            </label>
        )
    }
)
Switch.displayName = 'Switch'

export { Switch }

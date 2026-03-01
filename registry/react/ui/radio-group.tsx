'use client'

import * as React from 'react'
import { cva } from '../lib/cva'
import { cn } from '../lib/utils'
import * as radio from '@zag-js/radio-group'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'


const radioGroupVariants = cva('grid gap-3')
const radioGroupItemVariants = cva(
    'border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50'
)
const radioGroupIndicatorVariants = cva('flex items-center justify-center')
const radioGroupIndicatorIconVariants = cva('h-2.5 w-2.5 fill-current text-current')

// Context
const RadioGroupContext = React.createContext<{
    api: radio.Api
} | null>(null)

function useRadioGroup() {
    const context = React.useContext(RadioGroupContext)
    if (!context) {
        throw new Error('RadioGroupItem must be used within RadioGroup')
    }
    return context
}

interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
    value?: string
    defaultValue?: string
    disabled?: boolean
    name?: string
    required?: boolean
    id?: string
    onValueChange?: (value: string) => void
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
    (
        { className, value, defaultValue, onValueChange, disabled, required, name, id, ...props },
        ref
    ) => {
        const generatedId = React.useId()
        const radioGroupId = id ?? generatedId
        const service = useMachine(radio.machine, {
            id: radioGroupId,
            value,
            defaultValue, // zag supports defaultValue if uncontrolled
            disabled,
            required,
            name,
            onValueChange(details) {
                onValueChange?.(details.value ?? "")
            },
        })
        const api = radio.connect(service, normalizeProps)
        const rootProps = api.getRootProps()
        const mergedRootProps = mergeProps(rootProps, props) as React.HTMLAttributes<HTMLDivElement>
        const { className: rootClassName, ...rootRest } = mergedRootProps

        return (
            <RadioGroupContext.Provider value={{ api }}>
                <div
                    {...rootRest}
                    ref={ref}
                    data-slot="radio-group"
                    className={cn(radioGroupVariants(), rootClassName, className)}
                />
            </RadioGroupContext.Provider>
        )
    }
)
RadioGroup.displayName = "RadioGroup"

interface RadioGroupItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string
    disabled?: boolean
}

const RadioGroupItem = React.forwardRef<HTMLDivElement, RadioGroupItemProps>(
    ({ className, value, disabled: itemDisabled, ...props }, ref) => {
        const { api } = useRadioGroup()
        const itemProps = api.getItemProps({ value, disabled: itemDisabled })
        const controlProps = api.getItemControlProps({ value, disabled: itemDisabled })
        const hiddenInputProps = api.getItemHiddenInputProps({ value, disabled: itemDisabled })
        const itemState = api.getItemState({ value, disabled: itemDisabled })
        const mergedControlProps = mergeProps(controlProps, props)
        const { className: controlClassName, ...controlRest } = mergedControlProps

        return (
            <label {...itemProps} data-slot="radio-group-item">
                <div
                    {...controlRest}
                    ref={ref}
                    data-slot="radio-control"
                    className={cn(radioGroupItemVariants(), controlClassName, className)}
                >
                    <span data-slot="radio-indicator" className={radioGroupIndicatorVariants()}>
                        {itemState.checked && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={radioGroupIndicatorIconVariants()} aria-hidden="true"><circle cx="12" cy="12" r="10" /></svg>
                        )}
                    </span>
                </div>
                <input {...hiddenInputProps} />
            </label>
        )
    }
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }

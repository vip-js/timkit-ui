'use client'

import * as React from 'react'
import type { DateRange } from 'react-day-picker'
import { cva } from '../lib/cva'
import { cn } from '../lib/utils'
import { Button } from './button'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

const datePickerRootVariants = cva('w-full')
const datePickerTriggerButtonVariants = cva(
    'bg-background border-input w-full justify-between px-3 text-sm font-normal outline-offset-0 outline-none focus-visible:outline-[3px]'
)
const datePickerTriggerIconVariants = cva('text-muted-foreground/80 -ms-1 shrink-0')
const datePickerTriggerLabelVariants = cva('truncate')
const datePickerTriggerLabelEmptyVariants = cva('font-medium')
const datePickerContentVariants = cva('w-auto p-2')
const datePickerTriggerVariants = cva('w-full')


type DatePickerMode = 'single' | 'range'
type DatePickerValue = Date | DateRange | undefined

interface DatePickerProps {
    mode?: DatePickerMode
    value?: DatePickerValue
    defaultValue?: DatePickerValue
    onValueChange?: (value: DatePickerValue) => void
    placeholder?: string
    className?: string
    triggerClassName?: string
    contentClassName?: string
    calendarProps?: Omit<React.ComponentProps<typeof Calendar>, 'mode' | 'selected' | 'onSelect'>
}

const formatSingle = (value: Date) =>
    new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(
        value
    )
const formatRange = (value: DateRange) => {
    if (value.from && value.to) {
        return `${formatSingle(value.from)} - ${formatSingle(value.to)}`
    }
    if (value.from) {
        return formatSingle(value.from)
    }
    return ''
}

function DatePicker({
    mode = 'single',
    value,
    defaultValue,
    onValueChange,
    placeholder = 'Date',
    className,
    triggerClassName,
    contentClassName,
    calendarProps,
}: DatePickerProps) {
    const isControlled = value !== undefined
    const [uncontrolled, setUncontrolled] = React.useState<DatePickerValue>(defaultValue)
    const selected = isControlled ? value : uncontrolled

    const calendarSelected =
        mode === 'range'
            ? (selected as DateRange | undefined)
            : selected instanceof Date
                ? selected
                : undefined

    const handleChange = React.useCallback(
        (next: DatePickerValue) => {
            if (!isControlled) setUncontrolled(next)
            onValueChange?.(next)
        },
        [isControlled, onValueChange]
    )

    const label = React.useMemo(() => {
        if (mode === 'range') {
            return selected && typeof selected === 'object' && 'from' in selected
                ? formatRange(selected as DateRange)
                : ''
        }
        return selected instanceof Date ? formatSingle(selected) : ''
    }, [mode, selected])

    React.useEffect(() => {
        if (mode === 'single' && selected && typeof selected === 'object' && 'from' in selected) {
            const next = selected.from ?? undefined
            if (next !== selected.from) handleChange(next)
            return
        }
        if (mode === 'range' && selected instanceof Date) {
            handleChange({ from: selected, to: undefined })
        }
    }, [mode, selected, handleChange])

    return (
        <div data-slot="date-picker" className={cn(datePickerRootVariants(), className)}>
            <Popover>
                <PopoverTrigger
                    asChild
                    data-slot="date-picker-trigger"
                    className={cn(datePickerTriggerVariants())}
                >
                    <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                            datePickerTriggerButtonVariants(),
                            triggerClassName
                        )}
                    >
                        <svg
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={cn(datePickerTriggerIconVariants())}
                            aria-hidden="true"
                        >
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <path d="M8 2v4" />
                            <path d="M16 2v4" />
                            <path d="M3 10h18" />
                        </svg>
                        <span
                            className={cn(
                                datePickerTriggerLabelVariants(),
                                !label && datePickerTriggerLabelEmptyVariants()
                            )}
                        >
                            {label || placeholder}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    data-slot="date-picker-content"
                    className={cn(datePickerContentVariants(), contentClassName)}
                    align="start"
                >
                    <Calendar
                        mode={mode as any}
                        selected={calendarSelected as any}
                        onSelect={(next: any) =>
                            handleChange(next as DatePickerValue)
                        }
                        {...calendarProps}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export { DatePicker }
export type { DatePickerProps, DatePickerMode, DatePickerValue }

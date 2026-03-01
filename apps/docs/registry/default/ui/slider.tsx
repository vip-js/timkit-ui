'use client'

import * as React from 'react'
import { cn, sliderMachine } from '@timui/core'

import { useMachine } from '../hooks/use-machine'

const Slider = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLAttributes<HTMLDivElement>, 'value' | 'defaultValue'> & {
    value?: number[]
    defaultValue?: number[]
    min?: number
    max?: number
    step?: number
    orientation?: 'horizontal' | 'vertical'
    showTooltip?: boolean
    tooltipContent?: (value: number) => string
    onValueChange?: (value: number[]) => void
    onValueCommit?: (value: number[]) => void
    disabled?: boolean
  }
>(
  (
    {
      className,
      value,
      defaultValue,
      min = 0,
      max = 100,
      step = 1,
      orientation = 'horizontal',
      showTooltip: _showTooltip,
      tooltipContent: _tooltipContent,
      onValueChange,
      onValueCommit,
      disabled,
      ...props
    },
    ref
  ) => {
    void _showTooltip
    void _tooltipContent
    const initialValue = value !== undefined ? value : defaultValue || [min]

    const [state, send] = useMachine(sliderMachine, {
      context: {
        value: initialValue,
        min,
        max,
        step,
        disabled,
      },
    })

    const currentValue = state.context.value[0] // Support single thumb for now

    // Sync
    React.useEffect(() => {
      if (value !== undefined && JSON.stringify(value) !== JSON.stringify(state.context.value)) {
        send({ type: 'VALUE.SET', value })
      }
    }, [value, send, state.context.value])

    const trackRef = React.useRef<HTMLDivElement>(null)

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault() // prevent selection
      const track = trackRef.current
      if (!track) return

      track.setPointerCapture(event.pointerId)

      const updateValue = (clientX: number, clientY: number) => {
        const rect = track.getBoundingClientRect()
        const percent =
          orientation === 'vertical'
            ? 1 - Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1)
            : Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
        const rawValue = min + percent * (max - min)
        const steppedValue = Math.round(rawValue / step) * step
        // Clamp
        const finalValue = Math.min(Math.max(steppedValue, min), max)

        if (finalValue !== currentValue) {
          const nextValue = [finalValue]
          send({ type: 'VALUE.SET', value: nextValue })
          onValueChange?.(nextValue)
        }
      }

      updateValue(event.clientX, event.clientY)

      const handlePointerMove = (e: PointerEvent) => {
        updateValue(e.clientX, e.clientY)
      }

      const handlePointerUp = (e: PointerEvent) => {
        track.releasePointerCapture(e.pointerId)
        track.removeEventListener('pointermove', handlePointerMove)
        track.removeEventListener('pointerup', handlePointerUp)

        // Commit value
        if (state.context.value) {
          onValueCommit?.(state.context.value)
        }
      }

      track.addEventListener('pointermove', handlePointerMove)
      track.addEventListener('pointerup', handlePointerUp)
    }

    const percent = ((currentValue - min) / (max - min)) * 100

    return (
      <div
        ref={ref}
        data-slot="slider"
        data-orientation={orientation}
        data-disabled={disabled}
        className={cn(
          'relative flex w-full touch-none select-none items-center data-[disabled=true]:opacity-50',
          className
        )}
        {...props}
      >
        <div
          ref={trackRef}
          className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary cursor-pointer"
          onPointerDown={handlePointerDown}
        >
          <div
            data-slot="slider-range"
            className="absolute h-full bg-primary"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div
          data-slot="slider-thumb"
          className="pointer-events-none absolute block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          style={{ left: `${percent}%`, transform: 'translateX(-50%)' }}
        />
      </div>
    )
  }
)
Slider.displayName = 'Slider'

export { Slider }

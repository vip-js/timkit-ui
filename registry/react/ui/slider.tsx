'use client'

import * as React from 'react'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as slider from '@zag-js/slider'

import { cva } from '../lib/cva'
import { cn } from '../lib/utils'

const sliderRootVariants = cva(
  'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col'
)
const sliderTrackVariants = cva(
  'bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5'
)
const sliderRangeVariants = cva(
  'bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full'
)
const sliderThumbVariants = cva(
  'border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] outline-none hover:ring-4 focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50'
)

interface SliderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  onValueChange?: (value: number[]) => void
  onValueChangeEnd?: (value: number[]) => void
  name?: string
  id?: string
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      value,
      defaultValue,
      min = 0,
      max = 100,
      step = 1,
      onValueChange,
      onValueChangeEnd,
      disabled,
      id,
      name,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const sliderId = id ?? generatedId
    const service: slider.Service = useMachine(slider.machine, {
      id: sliderId,
      value,
      min,
      max,
      step,
      disabled,
      name,
      onValueChange(details) {
        onValueChange?.(details.value)
      },
      onValueChangeEnd(details) {
        onValueChangeEnd?.(details.value)
      },
    })
    const api = slider.connect(service, normalizeProps)
    const rootProps = api.getRootProps()
    const trackProps = api.getTrackProps()
    const rangeProps = api.getRangeProps()
    const mergedRootProps = mergeProps(
      rootProps,
      props as unknown as Record<string, unknown>
    ) as Record<string, unknown>
    const { className: rootClassName, ...rootRest } = mergedRootProps as {
      className?: string
    }

    return (
      <div
        {...(rootRest as React.HTMLAttributes<HTMLDivElement>)}
        ref={ref}
        data-slot="slider"
        className={cn(sliderRootVariants(), rootClassName, className)}
      >
        <div
          {...trackProps}
          data-slot="slider-track"
          className={cn(sliderTrackVariants(), trackProps.className)}
        >
          <div
            {...rangeProps}
            data-slot="slider-range"
            className={cn(sliderRangeVariants(), rangeProps.className)}
          />
        </div>
        {api.value.map((_, index) => {
          const thumbProps = api.getThumbProps({ index })
          const hiddenInputProps = api.getHiddenInputProps({ index })
          return (
            <React.Fragment key={index}>
              <div
                {...thumbProps}
                data-slot="slider-thumb"
                className={cn(sliderThumbVariants(), thumbProps.className)}
              />
              <input {...hiddenInputProps} />
            </React.Fragment>
          )
        })}
      </div>
    )
  }
)
Slider.displayName = 'Slider'

export { Slider }

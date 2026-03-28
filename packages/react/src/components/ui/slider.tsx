'use client'

import * as React from 'react'
import type { SliderProps as CoreSliderProps } from '@timui/core'
import {
  cn,
  sliderRangeVariants,
  sliderRootVariants,
  sliderThumbVariants,
  sliderTrackVariants,
} from '@timui/core'
import { mergeProps } from '@zag-js/react'

import { useSlider } from './slider/use-slider'

type SliderProps = CoreSliderProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof CoreSliderProps>

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      value,
      defaultValue,
      min = 0,
      max = 100,
      step = 1,
      minStepsBetweenThumbs,
      origin,
      thumbAlignment,
      thumbSize,
      thumbCollisionBehavior,
      name,
      form,
      dir,
      readOnly,
      invalid,
      getAriaValueText,
      onFocusChange,
      orientation = 'horizontal',
      ['aria-label']: ariaLabel,
      ['aria-labelledby']: ariaLabelledBy,
      ids,
      showTooltip = false,
      tooltipContent,
      onValueChange,
      onValueChangeEnd,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const api = useSlider({
      id,
      value,
      defaultValue,
      min,
      max,
      step,
      minStepsBetweenThumbs,
      orientation,
      origin,
      thumbAlignment,
      thumbSize,
      thumbCollisionBehavior,
      name,
      form,
      dir,
      readOnly,
      invalid,
      getAriaValueText,
      onFocusChange,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ids,
      disabled,
      onValueChange,
      onValueChangeEnd,
    })
    const rootProps = api.getRootProps()
    const controlProps = api.getControlProps()
    const trackProps = api.getTrackProps()
    const rangeProps = api.getRangeProps()
    const mergedRootProps = mergeProps(
      rootProps,
      props as React.HTMLAttributes<HTMLDivElement>
    ) as React.HTMLAttributes<HTMLDivElement>
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
          {...controlProps}
          data-slot="slider-control"
          className={cn(
            'relative flex w-full touch-none items-center select-none data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
            controlProps.className
          )}
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
            const thumbValue = api.value[index] ?? min
            const tooltipText = tooltipContent?.(thumbValue) ?? `${thumbValue}`
            return (
              <React.Fragment key={index}>
                <div
                  {...thumbProps}
                  data-slot="slider-thumb"
                  className={cn(sliderThumbVariants(), thumbProps.className)}
                >
                  {showTooltip ? (
                    <span
                      className={cn(
                        'bg-foreground text-background pointer-events-none absolute z-10 inline-flex min-w-6 items-center justify-center rounded px-1.5 py-0.5 text-[11px] leading-none font-medium whitespace-nowrap shadow-sm',
                        orientation === 'vertical'
                          ? 'top-1/2 left-full ml-2 -translate-y-1/2'
                          : '-top-8 left-1/2 -translate-x-1/2'
                      )}
                    >
                      {tooltipText}
                    </span>
                  ) : null}
                </div>
                <input {...hiddenInputProps} />
              </React.Fragment>
            )
          })}
        </div>
      </div>
    )
  }
)
Slider.displayName = 'Slider'

export { Slider }

'use client'

import * as React from 'react'
import type { AssertNoExtraKeys, SliderProps as CoreSliderProps } from '@timui/core'
import { sliderConnect, sliderMachine } from '@timui/core'
import {
  cn,
  createTimEvent,
  sliderRangeVariants,
  sliderRootVariants,
  sliderThumbVariants,
  sliderTrackVariants,
} from '@timui/core'
import { mergeProps } from '@zag-js/react'
import { useSlider } from './slider/use-slider'

type SliderProps = CoreSliderProps &
{
  showTooltip?: boolean
  tooltipContent?: (value: number) => string
} & Omit<React.HTMLAttributes<HTMLDivElement>, keyof CoreSliderProps | 'showTooltip'>

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      value,
      defaultValue,
      min = 0,
      max = 100,
      step = 1,
      showTooltip: _showTooltip,
      tooltipContent: _tooltipContent,
      onValueChange,
      onValueChangeEnd,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    void _showTooltip
    void _tooltipContent
    const api = useSlider({
      id,
      value,
      defaultValue,
      min,
      max,
      step,
      disabled,
      onValueChange,
      onValueChangeEnd,
    })
    const rootProps = api.getRootProps()
    const trackProps = api.getTrackProps()
    const rangeProps = api.getRangeProps()
    const mergedRootProps = mergeProps(rootProps, props as React.HTMLAttributes<HTMLDivElement>) as React.HTMLAttributes<HTMLDivElement>
    const { className: rootClassName, ...rootRest } = mergedRootProps as {
      className?: string
    }

    return (
      <div
        {...(rootRest as React.HTMLAttributes<HTMLDivElement>)}
        ref={ref}
        data-slot="slider"
        className={cn(
          sliderRootVariants(),
          rootClassName,
          className
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
Slider.displayName = "Slider"

export { Slider }

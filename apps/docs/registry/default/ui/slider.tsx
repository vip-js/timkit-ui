'use client'

import * as React from 'react'
import { cn, sliderConnect, sliderMachine } from '@timui/core'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'

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
      showTooltip = false,
      tooltipContent,
      onValueChange,
      onValueCommit,
      disabled,
      ...props
    },
    ref
  ) => {
    const service = useMachine(sliderMachine, {
      id: React.useId(),
      value,
      defaultValue,
      min,
      max,
      step,
      orientation,
      disabled,
      onValueChange(details) {
        onValueChange?.(details.value)
      },
      onValueChangeEnd(details) {
        onValueCommit?.(details.value)
      },
    })
    const api = React.useMemo(() => sliderConnect(service, normalizeProps), [service])

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
        className={cn(
          'relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
          rootClassName,
          className
        )}
      >
        <div
          {...controlProps}
          data-slot="slider-control"
          className={cn(
            'relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
            controlProps.className
          )}
        >
          <div
            {...trackProps}
            data-slot="slider-track"
            className={cn(
              'bg-secondary relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2',
              trackProps.className
            )}
          >
            <div
              {...rangeProps}
              data-slot="slider-range"
              className={cn(
                'bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
                rangeProps.className
              )}
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
                  className={cn(
                    'border-primary bg-background ring-ring/50 block size-5 shrink-0 rounded-full border-2 shadow-sm transition-[color,box-shadow] outline-none hover:ring-4 focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50',
                    thumbProps.className
                  )}
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

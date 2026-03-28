import * as React from 'react'
import type { SliderProps as CoreSliderProps } from '@timui/core'
import { createTimEvent, sliderConnect, sliderMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseSliderProps extends Omit<CoreSliderProps, 'id'> {
  id?: string
}

export function useSlider(props: UseSliderProps) {
  const generatedId = React.useId()
  const sliderId = props.id ?? generatedId
  const {
    id: _id,
    onValueChange,
    onValueChangeEnd,
    showTooltip: _showTooltip,
    tooltipContent: _tooltipContent,
    min,
    max,
    step,
    ...machineProps
  } = props
  void _id
  void _showTooltip
  void _tooltipContent

  const service = useMachine(sliderMachine, {
    ...machineProps,
    id: sliderId,
    min: min ?? 0,
    max: max ?? 100,
    step: step ?? 1,
    onValueChange(details) {
      const event = createTimEvent('change', sliderId, {
        value: details.value,
      }) as never as Parameters<NonNullable<CoreSliderProps['onValueChange']>>[0]
      onValueChange?.(event)
    },
    onValueChangeEnd(details) {
      const event = createTimEvent('change-end', sliderId, {
        value: details.value,
      }) as never as Parameters<NonNullable<CoreSliderProps['onValueChangeEnd']>>[0]
      onValueChangeEnd?.(event)
    },
  })

  const api = React.useMemo(() => sliderConnect(service, normalizeProps), [service])

  return api
}

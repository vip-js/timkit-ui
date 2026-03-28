import { computed, ref } from 'vue'

type UseSliderWithInputProps = {
  minValue?: number
  maxValue?: number
  initialValue?: number[]
  defaultValue?: number[]
}

export function useSliderWithInput({
  minValue = 0,
  maxValue = 100,
  initialValue = [minValue],
  defaultValue = [minValue],
}: UseSliderWithInputProps) {
  const sliderValue = ref([...initialValue])
  const inputValues = ref(initialValue.map((value) => value.toString()))

  const showReset = computed(() => {
    if (sliderValue.value.length !== defaultValue.length) return false
    return !sliderValue.value.every((value, index) => value === defaultValue[index])
  })

  function validateAndUpdateValue(rawValue: string, index: number) {
    if (rawValue === '' || rawValue === '-') {
      inputValues.value[index] = '0'
      sliderValue.value[index] = 0
      return
    }

    const parsedValue = Number.parseFloat(rawValue)

    if (Number.isNaN(parsedValue)) {
      inputValues.value[index] = sliderValue.value[index]?.toString() ?? '0'
      return
    }

    let clampedValue = Math.min(maxValue, Math.max(minValue, parsedValue))

    if (sliderValue.value.length > 1) {
      if (index === 0) {
        clampedValue = Math.min(clampedValue, sliderValue.value[1] ?? clampedValue)
      } else {
        clampedValue = Math.max(clampedValue, sliderValue.value[0] ?? clampedValue)
      }
    }

    sliderValue.value[index] = clampedValue
    inputValues.value[index] = clampedValue.toString()
  }

  function handleInputChange(eventOrValue: Event | string | number, index: number) {
    const nextValue =
      typeof eventOrValue === 'string' || typeof eventOrValue === 'number'
        ? String(eventOrValue)
        : (eventOrValue.target as HTMLInputElement).value

    if (nextValue === '' || /^-?\d*\.?\d*$/.test(nextValue)) {
      inputValues.value[index] = nextValue
    }
  }

  function handleSliderChange(nextValue: number[]) {
    sliderValue.value = [...nextValue]
    inputValues.value = nextValue.map((value) => value.toString())
  }

  function resetToDefault() {
    sliderValue.value = [...defaultValue]
    inputValues.value = defaultValue.map((value) => value.toString())
  }

  return {
    sliderValue,
    inputValues,
    validateAndUpdateValue,
    handleInputChange,
    handleSliderChange,
    resetToDefault,
    showReset,
  }
}

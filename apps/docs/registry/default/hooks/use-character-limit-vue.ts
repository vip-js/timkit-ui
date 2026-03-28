import { computed, ref, watch } from 'vue'

type UseCharacterLimitProps = {
  maxLength: number
  initialValue?: string
}

export function useCharacterLimit({ maxLength, initialValue = '' }: UseCharacterLimitProps) {
  const value = ref(initialValue)

  watch(value, (nextValue) => {
    if (nextValue.length > maxLength) {
      value.value = nextValue.slice(0, maxLength)
    }
  })

  const characterCount = computed(() => value.value.length)

  function handleChange(eventOrValue: Event | string | number) {
    const nextValue =
      typeof eventOrValue === 'string' || typeof eventOrValue === 'number'
        ? String(eventOrValue)
        : (eventOrValue.target as HTMLInputElement | HTMLTextAreaElement).value

    if (nextValue.length <= maxLength) {
      value.value = nextValue
    }
  }

  return {
    value,
    characterCount,
    handleChange,
    maxLength,
  }
}

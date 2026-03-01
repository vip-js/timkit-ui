<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { cn } from '@timui/core'
import { Button } from './button.vue'
import { Calendar } from './calendar.vue'
import { Popover } from './popover.vue'
import { PopoverTrigger } from './popover-trigger.vue'
import { PopoverContent } from './popover-content.vue'

type DatePickerMode = 'single' | 'range'

type RangeValue = { from?: Date; to?: Date } | undefined

type DatePickerValue = Date | RangeValue | undefined

const props = withDefaults(
  defineProps<{
    modelValue?: DatePickerValue
    defaultValue?: DatePickerValue
    mode?: DatePickerMode
    placeholder?: string
    class?: string
    triggerClass?: string
    contentClass?: string
  }>(),
  {
    mode: 'single',
    placeholder: 'Date',
  }
)

const emit = defineEmits(['update:modelValue', 'change'])

const internalValue = ref<DatePickerValue>(props.modelValue ?? props.defaultValue)

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined) internalValue.value = val
  }
)

const setValue = (next: DatePickerValue) => {
  internalValue.value = next
  emit('update:modelValue', next)
  emit('change', next)
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(
    date
  )

const label = computed(() => {
  const selected = internalValue.value
  if (props.mode === 'range') {
    if (!selected || !(selected as RangeValue)?.from) return ''
    const range = selected as RangeValue
    if (range.from && range.to) return `${formatDate(range.from)} - ${formatDate(range.to)}`
    if (range.from) return formatDate(range.from)
    return ''
  }
  return selected instanceof Date ? formatDate(selected) : ''
})
</script>

<template>
  <div data-slot="date-picker" :class="cn('w-full', props.class)">
    <Popover>
      <PopoverTrigger as-child class="w-full">
        <Button
          variant="outline"
          size="sm"
          :class="cn('bg-background border-input w-full justify-between px-3 text-sm font-normal outline-offset-0 outline-none focus-visible:outline-[3px]', props.triggerClass)"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-muted-foreground/80 -ms-1 shrink-0"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <path d="M3 10h18" />
          </svg>
          <span :class="cn('truncate', !label && 'font-medium')">{{ label || props.placeholder }}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        data-slot="date-picker-content"
        align="start"
        :class="cn('w-auto p-2', props.contentClass)"
      >
        <Calendar
          :mode="props.mode"
          :model-value="internalValue"
          @update:model-value="setValue"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>

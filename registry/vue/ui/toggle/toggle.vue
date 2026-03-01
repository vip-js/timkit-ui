<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { normalizeProps, useMachine } from '@zag-js/vue'
import * as toggle from '@zag-js/toggle'
import { cva, type VariantProps } from '../../lib/cva'
import { cn } from '../../lib/utils'

const toggleVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
    {
        variants: {
            variant: {
                default: 'bg-transparent',
                outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
            },
            size: {
                default: 'h-10 px-3',
                sm: 'h-9 px-2.5',
                lg: 'h-11 px-5',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

type ToggleVariants = VariantProps<typeof toggleVariants>

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    variant?: ToggleVariants['variant']
    size?: ToggleVariants['size']
    pressed?: boolean
    modelValue?: boolean
    defaultPressed?: boolean
    disabled?: boolean
    id?: string
  }>(),
  {
    variant: 'default',
    size: 'default',
    disabled: false,
  },
)

const emit = defineEmits(['update:pressed', 'update:modelValue', 'pressedChange', 'change'])

const machineProps = computed(() => {
  const pressed = props.pressed ?? props.modelValue
  return {
    id: props.id,
    pressed,
    defaultPressed: pressed === undefined ? props.defaultPressed : undefined,
    disabled: props.disabled,
    onPressedChange: (details: any) => {
      // Zag JS toggle details.pressed
      const next = details.pressed
      emit('update:pressed', next)
      emit('update:modelValue', next)
      emit('pressedChange', next)
      emit('change', next)
    },
  }
})

const service = useMachine(toggle.machine, machineProps)
const api = computed(() => toggle.connect(service, normalizeProps))

const computedClass = computed(() =>
  cn(toggleVariants({ variant: props.variant, size: props.size }), props.class),
)
</script>

<template>
  <button
    v-bind="api.getRootProps()"
    type="button"
    data-slot="toggle"
    :class="computedClass"
  >
    <slot />
  </button>
</template>

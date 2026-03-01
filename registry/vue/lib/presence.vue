<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import * as presence from '@zag-js/presence'
import { normalizeProps, useMachine } from '@zag-js/vue'

const props = withDefaults(
  defineProps<{
    present: boolean
    lazyMount?: boolean
    unmountOnExit?: boolean
    asChild?: boolean
  }>(),
  {
    lazyMount: false,
    unmountOnExit: false,
    asChild: false,
  },
)

const emit = defineEmits<{
  'exit-complete': []
}>()

const nodeRef = ref<HTMLElement | null>(null)

const service = useMachine(presence.machine, {
  present: props.present,
  onExitComplete() {
    emit('exit-complete')
  },
})

const api = computed(() => presence.connect(service, normalizeProps))

watch(
  () => nodeRef.value,
  (node) => {
    if (node) {
      api.value.setNode(node)
    }
  },
  { immediate: true },
)

watch(
  () => props.present,
  (present) => {
    api.value.setPresent(present)
  },
  { immediate: true },
)

const unmounted = computed(() => {
  return !api.value.present && !props.present && props.unmountOnExit
})

const hidden = computed(() => {
  if (!api.value.present && !props.present && !props.unmountOnExit) return true
  return false
})

const state = computed(() => (props.present ? 'open' : 'closed'))
</script>

<template>
  <template v-if="unmounted">
    <!-- Unmounted -->
  </template>
  <div
    v-else
    ref="nodeRef"
    :hidden="hidden"
    :data-state="state"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

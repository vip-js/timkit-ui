<script setup lang="ts">
import type { AssertNoExtraKeys, NavigationMenuProps } from '@timui/core'
import { cn, navigationMenuVariants } from '@timui/core'
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  type HTMLAttributes,
} from 'vue'

import { usePassedProp } from '../../../hooks/passed-prop'

import NavigationMenuViewport from './navigation-menu-viewport.vue'
import { provideNavigationMenuRootContext } from './use-navigation-menu-context'

type Props = NavigationMenuProps & {
  class?: HTMLAttributes['class']
  viewport?: boolean
  disabled?: boolean
}
type _NavigationMenuPropsGuard = AssertNoExtraKeys<
  Props,
  NavigationMenuProps & { class?: HTMLAttributes['class']; viewport?: boolean; disabled?: boolean }
>

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  viewport: true,
})
const attrs = useAttrs()
const navLabel = computed(() => {
  if (attrs['aria-labelledby']) return undefined
  const label = attrs['aria-label']
  return typeof label === 'string' && label ? label : 'Navigation'
})

const rootRef = ref<HTMLElement | null>(null)
const openState = ref<string | null>(null)
const items = ref<string[]>([])
const register = (value: string) => {
  if (value) items.value = [...items.value, value]
  return () => {
    const index = items.value.indexOf(value)
    if (index >= 0) items.value = items.value.filter((_, itemIndex) => itemIndex !== index)
  }
}
const passed = usePassedProp()
const openItem = computed(() => {
  const controlled = passed<string>(props, 'value')
  return controlled !== undefined ? controlled || null : openState.value
})
const itemStatus = computed(() => {
  const current = openItem.value
  if (!current) return ''
  const index = items.value.indexOf(current)
  return index < 0 ? '' : `Item ${index + 1} of ${items.value.length}`
})
const activeItem = ref<string | null>(null)
const userSelected = ref(false)
const viewport = computed(() => props.viewport ?? true)

const setOpenItem = (value: string | null) => {
  if (props.disabled) return
  if (passed<string>(props, 'value') === undefined) openState.value = value
  props.onValueChange?.(value)
}

const setActiveItem = (value: string | null) => {
  activeItem.value = value
}

const setUserSelected = (value: boolean) => {
  userSelected.value = value
}

const onPointerDown = (event: PointerEvent) => {
  const target = event.target
  if (!(target instanceof Node)) return
  if (!rootRef.value?.contains(target)) {
    setOpenItem(null)
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
})

provideNavigationMenuRootContext({
  openItem,
  setOpenItem,
  activeItem,
  setActiveItem,
  userSelected,
  setUserSelected,
  viewport,
  disabled: computed(() => props.disabled === true),
  register,
})
</script>

<template>
  <nav
    ref="rootRef"
    data-slot="navigation-menu"
    :data-orientation="props.orientation"
    :aria-disabled="props.disabled || undefined"
    :data-disabled="props.disabled ? '' : undefined"
    :aria-label="navLabel"
    :class="
      cn(navigationMenuVariants(), props.class)
    "
  >
    <p v-if="itemStatus" role="status">{{ itemStatus }}</p>
    <slot />
    <NavigationMenuViewport v-if="props.viewport" />
  </nav>
</template>

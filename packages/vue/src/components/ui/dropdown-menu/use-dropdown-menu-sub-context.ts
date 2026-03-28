import { inject, provide, ref, type InjectionKey, type Ref } from 'vue'

export type DropdownMenuSubContextValue = {
  open: Ref<boolean>
  setOpen: (open: boolean) => void
  triggerElement: Ref<HTMLElement | null>
}

const dropdownMenuSubContextKey: InjectionKey<DropdownMenuSubContextValue> = Symbol(
  'DropdownMenuSubContext'
)

export function createDropdownMenuSubContext(): DropdownMenuSubContextValue {
  const open = ref(false)
  const triggerElement = ref<HTMLElement | null>(null)

  return {
    open,
    triggerElement,
    setOpen(nextOpen: boolean) {
      open.value = nextOpen
    },
  }
}

export function provideDropdownMenuSubContext(value: DropdownMenuSubContextValue) {
  provide(dropdownMenuSubContextKey, value)
}

export function useDropdownMenuSubContext() {
  return inject(dropdownMenuSubContextKey, null)
}

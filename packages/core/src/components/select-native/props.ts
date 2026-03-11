export type SelectNativeProps = {
  options?: { label: string; value: string }[]
  /**
   * The controlled value of the component.
   */
  value?: string | string[]
  /**
   * The default value of the component when uncontrolled.
   */
  defaultValue?: string | string[]
  /**
   * When `true`, allows multiple items to be selected.
   */
  multiple?: boolean
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: string | string[]) => void
}

export type SelectNativeVueProps = {
  /**
   * The controlled value bound via `v-model` (Vue specific).
   */
  modelValue?: string | string[]
  /**
   * The default value of the component when uncontrolled.
   */
  defaultValue?: string | string[]
  /**
   * When `true`, allows multiple items to be selected.
   */
  multiple?: boolean
}

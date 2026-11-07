import { getCurrentInstance } from 'vue'

/** Vue casts omitted boolean props to false. Read the vnode so omitted stays undefined. */
export function usePassedProp() {
  const raw = getCurrentInstance()?.vnode.props ?? {}
  return <T,>(props: object, key: string): T | undefined => {
    const record = props as Record<string, T | undefined>
    const kebab = key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
    if (Object.prototype.hasOwnProperty.call(raw, key) || Object.prototype.hasOwnProperty.call(raw, kebab)) {
      return record[key]
    }
    return undefined
  }
}

/**
 * Inline clsx - no npm dependency required.
 * Adapted from https://github.com/lukeed/clsx (MIT License, Luke Edwards)
 */

export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | bigint
  | null
  | boolean
  | undefined

export type ClassDictionary = Record<string, unknown>
export type ClassArray = ClassValue[]

function toVal(mix: ClassValue): string {
  let str = ''
  if (mix == null || mix === false || mix === true) return str
  const type = typeof mix
  if (type === 'number' || type === 'bigint') return String(mix)
  if (type === 'string') return mix as string
  if (Array.isArray(mix)) {
    for (const item of mix) {
      const v = toVal(item as ClassValue)
      if (v) {
        if (str) str += ' '
        str += v
      }
    }
  } else if (type === 'object') {
    for (const key in mix as ClassDictionary) {
      if ((mix as ClassDictionary)[key]) {
        if (str) str += ' '
        str += key
      }
    }
  }
  return str
}

export function clsx(...args: ClassValue[]): string {
  let str = ''
  for (const arg of args) {
    const v = toVal(arg)
    if (v) {
      if (str) str += ' '
      str += v
    }
  }
  return str
}

export default clsx

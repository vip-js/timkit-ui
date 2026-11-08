import {
  createForm,
  fieldA11y,
  readFieldValue,
  setFieldValue,
  submitForm,
  type FieldSpec,
  type FormEvent,
  type FormSnapshot,
} from '@timui/core'
import { ref } from 'vue'

export function useForm(fields: FieldSpec[], options?: { disabled?: boolean }) {
  const snapshot = ref<FormSnapshot>(createForm(fields))
  const blocked = () => options?.disabled === true

  const update = (name: string, value: string) => {
    if (blocked()) return
    snapshot.value = setFieldValue(snapshot.value, name, value, fields)
  }

  const assign = (name: string, event: FormEvent) => {
    update(name, readFieldValue(event))
  }

  const submit = () => {
    if (blocked()) return { ok: false as const, snapshot: snapshot.value }
    const result = submitForm(snapshot.value, fields)
    snapshot.value = result.snapshot
    return result
  }

  const field = (name: string) => ({
    ...fieldA11y(name, snapshot.value.errors[name], fields.find((item) => item.name === name)?.hint),
    name,
    disabled: blocked() || undefined,
    value: snapshot.value.values[name] ?? '',
  })

  return { snapshot, update, assign, submit, field }
}

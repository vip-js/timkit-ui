import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@timui/react'

export default function Component() {
  return (
    <NumberField defaultValue={20} min={0} max={100} spinOnPress={false} aria-label="Quantity">
      <NumberFieldDecrement aria-label="Decrease quantity">−</NumberFieldDecrement>
      <NumberFieldInput />
      <NumberFieldIncrement aria-label="Increase quantity">+</NumberFieldIncrement>
    </NumberField>
  )
}

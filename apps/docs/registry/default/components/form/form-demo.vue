<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from '@timui/vue'

const status = ref('Waiting')
const fields = [
  {
    name: 'name',
    label: 'Name',
    rules: [
      { kind: 'required' as const, message: 'Name is required' },
      { kind: 'minLength' as const, min: 2, message: 'Use at least 2 characters' },
    ],
  },
  {
    name: 'email',
    label: 'Email',
    rules: [
      { kind: 'required' as const, message: 'Email is required' },
      { kind: 'email' as const, message: 'Enter a valid email' },
    ],
  },
  {
    name: 'terms',
    label: 'Terms',
    rules: [{ kind: 'checked' as const, message: 'Accept terms' }],
  },
]
const form = useForm(fields)

const onSubmit = () => {
  const result = form.submit()
  status.value = result.ok ? 'Submitted' : 'Invalid'
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <label for="name">Name</label>
    <input
      :id="form.field('name').id"
      type="text"
      aria-label="Name"
      :aria-invalid="form.field('name')['aria-invalid']"
      :aria-describedby="form.field('name')['aria-describedby']"
      @input="form.assign('name', $event)"
    />
    <p v-if="form.snapshot.value.errors.name" id="name-error" role="alert">{{ form.snapshot.value.errors.name }}</p>
    <label for="email">Email</label>
    <input
      :id="form.field('email').id"
      type="email"
      aria-label="Email"
      :aria-invalid="form.field('email')['aria-invalid']"
      :aria-describedby="form.field('email')['aria-describedby']"
      @input="form.assign('email', $event)"
    />
    <p v-if="form.snapshot.value.errors.email" id="email-error" role="alert">{{ form.snapshot.value.errors.email }}</p>
    <label>
      <input
        :id="form.field('terms').id"
        type="checkbox"
        aria-label="Accept terms"
        :aria-invalid="form.field('terms')['aria-invalid']"
        :aria-describedby="form.field('terms')['aria-describedby']"
        @change="form.assign('terms', $event)"
      />
      Accept terms
    </label>
    <p v-if="form.snapshot.value.errors.terms" id="terms-error" role="alert">{{ form.snapshot.value.errors.terms }}</p>
    <button type="submit">Create account</button>
    <p>{{ status }}</p>
  </form>
</template>

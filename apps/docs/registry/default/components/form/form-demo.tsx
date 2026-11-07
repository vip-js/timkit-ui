'use client'

import { useState } from 'react'
import { Checkbox, Form, Input, Label } from '@timui/react'

export default function FormDemo() {
  const [status, setStatus] = useState('Waiting')
  return (
    <Form
      submitLabel="Create account"
      fields={[
        {
          name: 'name',
          label: 'Name',
          rules: [
            { kind: 'required', message: 'Name is required' },
            { kind: 'minLength', min: 2, message: 'Use at least 2 characters' },
          ],
        },
        {
          name: 'email',
          label: 'Email',
          rules: [
            { kind: 'required', message: 'Email is required' },
            { kind: 'email', message: 'Enter a valid email' },
          ],
        },
        {
          name: 'terms',
          label: 'Terms',
          rules: [{ kind: 'checked', message: 'Accept terms' }],
        },
      ]}
      onSubmit={() => setStatus('Submitted')}
    >
      {(api) => (
        <>
          <Label htmlFor="name">Name</Label>
          <Input {...api.text('name')} />
          {api.error('name') ? (
            <p id="name-error" role="alert">
              {api.error('name')}
            </p>
          ) : null}
          <Label htmlFor="email">Email</Label>
          <Input type="email" {...api.text('email')} />
          {api.error('email') ? (
            <p id="email-error" role="alert">
              {api.error('email')}
            </p>
          ) : null}
          <Checkbox {...api.checked('terms')} aria-label="Accept terms" />
          {api.error('terms') ? (
            <p id="terms-error" role="alert">
              {api.error('terms')}
            </p>
          ) : null}
          <p>{status}</p>
        </>
      )}
    </Form>
  )
}

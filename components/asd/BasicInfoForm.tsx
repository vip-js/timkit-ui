'use client'
import { useState } from 'react'

type BasicInfo = {
  childName: string
  dateOfBirth: string
  gender: string
  concerns: string[]
}

export default function BasicInfoForm({
  onComplete,
}: {
  onComplete?: (data: BasicInfo) => void
}) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const info: BasicInfo = {
      childName: String(form.get('childName') || ''),
      dateOfBirth: String(form.get('dateOfBirth') || ''),
      gender: String(form.get('gender') || ''),
      concerns: form.getAll('concerns').map(String),
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('basicInfoSubmitted', 'true')
    }
    setSubmitted(true)
    onComplete?.(info)
  }

  return (
    <section className="rounded-lg bg-primary/5 p-4" data-testid="info-form">
      {!submitted ? (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Child&apos;s Name
            </label>
            <input
              type="text"
              name="childName"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="gender-btn rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                onClick={() => {
                  const input = document.querySelector<HTMLInputElement>('input[name="gender"]')!
                  input.value = 'male'
                }}
              >
                Boy
              </button>
              <button
                type="button"
                className="gender-btn rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                onClick={() => {
                  const input = document.querySelector<HTMLInputElement>('input[name="gender"]')!
                  input.value = 'female'
                }}
              >
                Girl
              </button>
            </div>
            <input type="hidden" name="gender" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Primary Concerns</label>
            <div className="grid grid-cols-2 gap-2">
              {['communication', 'social', 'behavior', 'motor'].map((c) => (
                <label
                  key={c}
                  className="concern flex cursor-pointer items-center rounded-lg border border-gray-200 p-3"
                >
                  <input type="checkbox" value={c} name="concerns" className="hidden" />
                  <span className="capitalize text-sm text-gray-700">{c}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-button bg-primary py-3 text-sm font-medium text-white"
          >
            Continue
          </button>
        </form>
      ) : (
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.285 6.708l-11.4 11.4-5.657-5.657 1.414-1.414 4.243 4.242 9.986-9.986z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">Information Saved!</h3>
          <p className="text-sm text-gray-600">Thank you for providing your child&apos;s information.</p>
        </div>
      )}
    </section>
  )
}

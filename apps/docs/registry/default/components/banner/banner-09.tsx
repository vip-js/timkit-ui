'use client'

import { useState } from 'react'
import {
  Banner,
  BannerActions,
  BannerContent,
  BannerDescription,
  BannerIcon,
  BannerTitle,
  Button,
} from '@timui/react'

export default function Component() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <Banner className="dark bg-muted text-foreground px-4 py-3">
      <BannerContent className="gap-2 md:items-center">
        <div className="flex grow gap-3 md:items-center">
          <BannerIcon className="bg-primary/15 flex size-9 shrink-0 items-center justify-center rounded-full max-md:mt-0.5">
            <svg
              className="opacity-80"
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4.5 16.5c-1.5-1.5-1-4.5 1-6.5 2-2 9-5 13-5 0 4-3 11-5 13-2 2-5 2.5-6.5 1L4 20l.5-3.5z" />
              <path d="M15 9 9 15" />
            </svg>
          </BannerIcon>
          <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="space-y-0.5">
              <BannerTitle>Boost your experience with Timkit UI</BannerTitle>
              <BannerDescription className="text-sm">
                The new feature is live! Try it out and let us know what you think.
              </BannerDescription>
            </div>
            <BannerActions className="flex gap-2 max-md:flex-wrap">
              <Button size="sm" className="text-sm">
                Try now
              </Button>
            </BannerActions>
          </div>
        </div>
        <BannerActions className="shrink-0">
          <Button
            variant="ghost"
            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
            onClick={() => setIsVisible(false)}
            aria-label="Close banner"
          >
            <svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-60 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="M6 6 18 18" />
            </svg>
          </Button>
        </BannerActions>
      </BannerContent>
    </Banner>
  )
}

'use client'

import { useState } from 'react'
import {
  Banner,
  BannerActions,
  BannerContent,
  BannerDescription,
  BannerIcon,
  Button,
} from '@timui/react'

export default function Component() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <Banner className="dark bg-muted text-foreground px-4 py-3">
      <BannerContent className="gap-2">
        <div className="flex grow gap-3">
          <BannerIcon className="mt-0.5 opacity-60">
            <svg
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
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </BannerIcon>
          <div className="flex grow flex-col justify-between gap-2 md:flex-row">
            <BannerDescription className="text-sm text-foreground">
              We just added something awesome to make your experience even better.
            </BannerDescription>
            <BannerActions className="text-sm">
              <a href="#" className="group text-sm font-medium whitespace-nowrap">
                Learn more
                <svg
                  className="ms-1 -mt-0.5 inline-flex opacity-60 transition-transform group-hover:translate-x-0.5"
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
                  <path d="M5 12h14" />
                  <path d="m13 5 7 7-7 7" />
                </svg>
              </a>
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

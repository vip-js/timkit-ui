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
    <Banner className="dark bg-muted text-foreground px-4 py-3 md:py-2">
      <BannerContent className="gap-2 md:items-center">
        <div className="flex grow gap-3 md:items-center md:justify-center">
          <BannerIcon className="opacity-60 max-md:mt-0.5">
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
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <BannerDescription className="text-sm text-foreground">
              It&lsquo;s live and ready to use! Start exploring the latest addition to your toolkit.
            </BannerDescription>
            <BannerActions className="flex gap-2 max-md:flex-wrap">
              <Button size="sm" className="rounded-full">
                Learn more
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

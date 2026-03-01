'use client'

import { useState } from 'react'
import { Banner, BannerActions, BannerContent, BannerDescription, Button } from '@timui/react'

export default function Component() {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = () => {
    setIsDownloading(true)
    // Simulate download
    setTimeout(() => {
      setIsDownloading(false)
    }, 2000)
  }

  return (
    <Banner className="bg-muted px-4 py-3 md:py-2">
      <BannerContent className="flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <BannerDescription className="text-sm text-foreground">
          <span className="font-medium">v2.1.0</span>
          <span className="text-muted-foreground mx-2">•</span>
          New features and improvements available
        </BannerDescription>
        <BannerActions>
          <Button
            size="sm"
            variant="outline"
            disabled={isDownloading}
            onClick={handleDownload}
            className="min-w-24"
          >
            {isDownloading ? (
              <>
                <svg
                  className="-ms-0.5 me-2 animate-spin"
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
                  <circle cx="12" cy="12" r="10" opacity="0.25" />
                  <path d="M22 12a10 10 0 0 1-10 10" />
                </svg>
                Updating...
              </>
            ) : (
              <>
                <svg
                  className="-ms-0.5"
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
                  <path d="M12 3v12" />
                  <path d="m7 10 5 5 5-5" />
                  <path d="M5 21h14" />
                </svg>
                Update now
              </>
            )}
          </Button>
        </BannerActions>
      </BannerContent>
    </Banner>
  )
}

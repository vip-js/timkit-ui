import { Banner, BannerContent, BannerDescription, BannerIcon } from '@timui/react'

export default function Component() {
  return (
    <Banner className="dark bg-muted text-foreground px-4 py-3">
      <BannerContent className="justify-center">
        <BannerIcon className="me-3 -mt-0.5 opacity-60">
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
        <BannerDescription className="text-sm text-foreground text-center">
          Get the most out of your app with real-time updates and analytics{' '}
          <span className="text-muted-foreground">·</span>{' '}
          <a href="#" className="font-medium underline hover:no-underline">
            Upgrade
          </a>
        </BannerDescription>
      </BannerContent>
    </Banner>
  )
}

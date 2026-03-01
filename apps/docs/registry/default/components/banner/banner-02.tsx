import { Banner, BannerContent, BannerDescription } from '@timui/react'

export default function Component() {
  return (
    <Banner className="dark bg-muted text-foreground px-4 py-3">
      <BannerContent className="justify-center">
        <BannerDescription className="text-sm text-foreground">
          <a href="#" className="group">
            <span className="me-1 text-base leading-none">✨</span>
            Introducing transactional and marketing emails
            <svg
              className="ms-2 -mt-0.5 inline-flex opacity-60 transition-transform group-hover:translate-x-0.5"
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
        </BannerDescription>
      </BannerContent>
    </Banner>
  )
}

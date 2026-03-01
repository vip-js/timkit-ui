import { Banner, BannerContent, BannerDescription, BannerIcon } from '@timui/react'

export default function Component() {
  return (
    <Banner className="border-b px-4 py-3">
      <BannerContent className="justify-center">
        <BannerIcon className="mr-1 text-base leading-none">📫</BannerIcon>
        <BannerDescription className="text-sm text-foreground text-center">
          Subscribe to our newsletter and get 10% off your first order!{' '}
          <span className="text-muted-foreground mx-1">·</span>{' '}
          <a href="#" className="font-medium underline hover:no-underline">
            Subscribe
          </a>
        </BannerDescription>
      </BannerContent>
    </Banner>
  )
}

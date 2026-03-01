import { Banner, BannerActions, BannerContent, BannerDescription, Button } from '@timui/react'

export default function Component() {
  return (
    <Banner className="bg-background z-50 rounded-md border px-4 py-3 shadow-lg">
      <BannerContent className="flex-col justify-between gap-3 md:flex-row md:items-center">
        <BannerDescription className="text-sm text-foreground">
          We use cookies to improve your experience, analyze site usage, and show personalized
          content.
        </BannerDescription>
        <BannerActions className="flex gap-2 max-md:flex-wrap">
          <Button size="sm">Accept</Button>
          <Button variant="outline" size="sm">
            Decline
          </Button>
        </BannerActions>
      </BannerContent>
    </Banner>
  )
}

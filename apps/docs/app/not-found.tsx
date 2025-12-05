import Link from "next/link"
import { Button } from "@timkit/web"

import PageHeader from "@/components/page-header"

export default function NotFound() {
  return (
    <>
      <PageHeader title="404" className="mb-6">
        The page you&apos;re looking for does not exist or is no longer here.
      </PageHeader>
      <div className="text-center">
        <Button asChild className="rounded-full">
          <Link href="/">Browse components</Link>
        </Button>
      </div>
    </>
  )
}

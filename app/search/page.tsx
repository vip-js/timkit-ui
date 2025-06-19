import { Suspense } from "react"
import type { Metadata } from "next"

import PageHeader from "@/components/page-header"

import ComponentsContainer from "./components-container"

export const metadata: Metadata = {
  title: "Search a TimKit UI component",
  description: "Search for components in the TimKit UI library.",
}

export default function Page() {
  return (
    <>
      <PageHeader title="Search TimKit UI" className="mb-10">
        Use this page to quickly find a component (e.g., multiselect, vertical
        slider, etc.)
      </PageHeader>
      <Suspense>
        <ComponentsContainer />
      </Suspense>
    </>
  )
}

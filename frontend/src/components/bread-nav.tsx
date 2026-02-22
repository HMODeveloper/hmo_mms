"use client"

import { IconArrowLeft } from "@tabler/icons-react"
import { usePathname, useRouter } from "next/navigation"
import { Fragment } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { useBread } from "@/src/contexts/bread"

export default function BreadNav() {
  const { labels } = useBread()
  const router = useRouter()
  const pathname = usePathname()
  const paths = pathname.split("/").filter(Boolean)

  return (
    <div className="flex gap-4 items-center">
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push(`/${paths.slice(0, -1).join("/")}`)}
          disabled={paths.length <= 1}
        >
          <IconArrowLeft />
        </Button>
      </div>
      <Breadcrumb>
        <BreadcrumbList>
          {labels.map((item, index) => (
            <Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <Badge>{item}</Badge>
                </BreadcrumbPage>
              </BreadcrumbItem>
              {labels.length > index + 1 && <BreadcrumbSeparator /> }
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

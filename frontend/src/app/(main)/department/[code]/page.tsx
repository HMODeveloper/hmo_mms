"use client"

import { useParams } from "next/navigation"
import { useBread } from "@/src/contexts/bread"

export default function () {
  const { code } = useParams<{ code: string }>()
  useBread("部门管理", code)
  return <></>
}

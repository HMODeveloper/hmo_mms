"use client"

import type { UserInfo } from "@/src/models/user"
import { IconArrowsSort, IconEye, IconSortAscending, IconSortDescending } from "@tabler/icons-react"
import dayjs from "dayjs"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useColleges } from "@/src/stores/colleges"
import { useMembers } from "@/src/stores/members"

type SortOption = "nickname" | "mcName" | "QQID" | "createAt" | "college"
const SORT_OPTION_MAP: Record<SortOption, string> = {
  nickname: "昵称",
  mcName: "游戏 ID",
  QQID: "QQ 号",
  createAt: "注册时间",
  college: "学院 / 学校",
}

type SortDirection = "asc" | "desc"
const SORT_DIRECTION_MAP: Record<SortDirection, string> = {
  asc: "升序",
  desc: "降序",
}

const SORT_OPTIONS: SortOption[] = ["nickname", "mcName", "QQID", "createAt", "college"]

export default function ListSection() {
  const { members } = useMembers()
  const { colleges } = useColleges()
  const router = useRouter()

  const [sortOption, setSortOption] = useState<SortOption>("nickname")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // 按字段比较函数
  const compareByField = (a: UserInfo, b: UserInfo, field: SortOption) => {
    switch (field) {
      case "nickname":
        return a.nickname.localeCompare(b.nickname)
      case "mcName":
        return (a.mcName ?? "").localeCompare(b.mcName ?? "")
      case "QQID":
        return a.QQID === b.QQID ? 0 : (a.QQID > b.QQID ? 1 : -1)
      case "createAt":
        return dayjs(a.createAt).isBefore(dayjs(b.createAt)) ? -1 : 1
      case "college":
        return (a.college).localeCompare(b.college)
      default:
        return 0
    }
  }

  const sortedMembers = useMemo(() => (
    Array.from(members).sort((a, b) => {
      const isASC = sortDirection === "asc"
      const result = compareByField(a, b, sortOption)
      return isASC ? result : -result
    })
  ), [members, sortOption, sortDirection])

  const getCollegeName = (user: UserInfo) => (
    colleges.find(item => item.code === user.college)?.name || "---"
  )

  const formatDepartment = (user: UserInfo) => (
    user.departments.map(item => item.name).join(", ") || "无"
  )

  const handleSortOptionSwitch = () => {
    const currentIndex = SORT_OPTIONS.indexOf(sortOption) ?? 0
    const nextIndex = (currentIndex + 1) % SORT_OPTIONS.length
    setSortOption(SORT_OPTIONS[nextIndex])
  }

  const handleSortDirectionSwitch = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>成员列表</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">序号</TableHead>
              <TableHead className="text-center">昵称</TableHead>
              <TableHead className="text-center">游戏 ID</TableHead>
              <TableHead className="text-center">QQ 号</TableHead>
              <TableHead className="text-center">注册时间</TableHead>
              <TableHead className="text-center">学院 / 学校</TableHead>
              <TableHead className="text-center">部门</TableHead>
              <TableHead className="text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMembers.map((item, index) => (
              <TableRow key={item.QQID}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">{item.nickname}</TableCell>
                <TableCell className="text-center">{item.mcName}</TableCell>
                <TableCell className="text-center">{item.QQID}</TableCell>
                <TableCell className="text-center">{dayjs(item.createAt).format("YYYY-MM-DD")}</TableCell>
                <TableCell className="text-center">{getCollegeName(item)}</TableCell>
                <TableCell className="text-center">{formatDepartment(item)}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => router.push(`/member/${item.QQID}`)}
                  >
                    <IconEye />
                    详情
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-end gap-4">
        <Button
          variant="outline"
          onClick={handleSortOptionSwitch}
        >
          <IconArrowsSort />
          按
          {SORT_OPTION_MAP[sortOption]}
          排序
        </Button>
        <Button
          variant="outline"
          onClick={handleSortDirectionSwitch}
        >
          {sortDirection === "asc" ? <IconSortAscending /> : <IconSortDescending />}
          {SORT_DIRECTION_MAP[sortDirection]}
          排列
        </Button>
      </CardFooter>
    </Card>
  )
}

"use client"

import type { User } from "@/src/models/user"
import { IconArrowsSort, IconEye, IconSortAscending, IconSortDescending } from "@tabler/icons-react"
import dayjs from "dayjs"
import Link from "next/link"
import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAppData } from "@/src/stores/app"

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

export default function () {
  const { getAllMembers } = useAppData()

  const [sortOption, setSortOption] = useState<SortOption>("nickname")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // 按字段比较函数
  const compareByField = (a: User, b: User, field: SortOption) => {
    switch (field) {
      case "nickname":
        return a.nickname.localeCompare(b.nickname)
      case "mcName":
        return (a.mcName ?? "").localeCompare(b.mcName ?? "")
      case "QQID":
        return a.QQID.localeCompare(b.QQID, undefined, { numeric: true })
      case "createAt":
        return dayjs(b.createAt).isAfter(dayjs(a.createAt)) ? 1 : -1
      case "college":
        return (a.college.name).localeCompare(b.college.name)
      default:
        return 0
    }
  }

  const sortedMembers = useMemo((): User[] => (
    Array.from(getAllMembers()).sort((a: User, b: User) => {
      const isASC = sortDirection === "asc"
      const result = compareByField(a, b, sortOption)
      return isASC ? result : -result
    })
  ), [getAllMembers, sortOption, sortDirection])

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
                <TableCell className="text-center">{item.formattedCreateAt}</TableCell>
                <TableCell className="text-center">
                  {item.college.code === "NOT_HNU"
                    ? <Badge variant="destructive">{item.school}</Badge>
                    : <Badge variant="secondary">{item.college.name}</Badge>}
                </TableCell>
                <TableCell className="text-center">
                  {item.departments.length > 0
                    ? (
                        <>
                          {item.departments.slice(0, 2).map(item => (
                            <Badge key={item.code} variant="secondary">{item.name}</Badge>
                          ))}
                          {item.departments.length > 2 && <Badge variant="secondary">...</Badge>}
                        </>
                      )
                    : <Badge variant="secondary">无</Badge>}
                </TableCell>
                <TableCell className="text-center">
                  <Badge asChild>
                    <Link href={`/member/${item.QQID}`}>
                      <IconEye />
                      详情
                    </Link>
                  </Badge>
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

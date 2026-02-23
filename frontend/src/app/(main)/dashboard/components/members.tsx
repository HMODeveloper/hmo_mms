"use client"

import type { User } from "@/src/models/user"
import dayjs from "dayjs"
import Link from "next/link"
import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ({
  members,
}: {
  members: User[]
}) {
  const recentMembers = useMemo(() => (
    Array.from(members)
      .sort((a, b) => dayjs(b.createAt).isAfter(dayjs(a.createAt)) ? 1 : -1)
      .slice(0, 5)
  ), [members])

  return (
    <Card>
      <CardHeader>
        <CardTitle>最近注册成员</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">昵称</TableHead>
              <TableHead className="text-center">游戏 ID</TableHead>
              <TableHead className="text-center">QQ 号</TableHead>
              <TableHead className="text-center">注册时间</TableHead>
              <TableHead className="text-center">部门</TableHead>
              <TableHead className="text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentMembers.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">暂无成员数据</TableCell>
                  </TableRow>
                )
              : recentMembers.map(item => (
                  <TableRow key={item.QQID}>
                    <TableCell className="text-center">{item.nickname}</TableCell>
                    <TableCell className="text-center">{item.mcName}</TableCell>
                    <TableCell className="text-center">{item.QQID}</TableCell>
                    <TableCell className="text-center">{item.formattedCreateAt}</TableCell>
                    <TableCell className="text-center">
                      {item.departments.length > 0
                        ? item.departments.slice(0, 2).map(d => (
                            <Badge key={d.code} variant="secondary">{d.name}</Badge>
                          ))
                        : <Badge variant="secondary">无</Badge>}
                      {item.departments.length > 2 && <Badge variant="secondary">...</Badge>}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge asChild>
                        <Link href={`/member/${item.QQID}`}>详情</Link>
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

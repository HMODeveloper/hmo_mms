"use client"

import type { Department } from "@/src/models/department"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ({
  departments,
}: {
  departments: Department[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>部门概览</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">部门名称</TableHead>
              <TableHead className="text-center">部长</TableHead>
              <TableHead className="text-center">成员数</TableHead>
              <TableHead className="text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">暂无部门数据</TableCell>
                  </TableRow>
                )
              : departments.map(dept => (
                  <TableRow key={dept.code}>
                    <TableCell className="text-center">{dept.name}</TableCell>
                    <TableCell className="text-center">
                      {dept.minister.length > 0
                        ? dept.minister.map(m => (
                            <Badge key={m.QQID} variant="secondary">{m.nickname}</Badge>
                          ))
                        : <Badge variant="secondary">无</Badge>}
                    </TableCell>
                    <TableCell className="text-center">{dept.member.length}</TableCell>
                    <TableCell className="text-center">
                      <Badge asChild>
                        <Link href={`/department/${dept.code}`}>详情</Link>
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

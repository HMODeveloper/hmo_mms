"use client"

import { IconEye } from "@tabler/icons-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAppData } from "@/src/stores/app"

export default function ListSection() {
  const { getAllDepartments } = useAppData()
  const departments = getAllDepartments()

  return (
    <Card>
      <CardHeader>
        <CardTitle>部门列表</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">序号</TableHead>
              <TableHead className="text-center">部门</TableHead>
              <TableHead className="text-center">部长</TableHead>
              <TableHead className="text-center">成员</TableHead>
              <TableHead className="text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((item, index) => (
              <TableRow key={item.code}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">{item.name}</TableCell>
                <TableCell className="text-center">
                  {item.minister.length > 0
                    ? item.minister.map(item => (
                        <Badge key={item.QQID} variant="secondary">{item.nickname}</Badge>
                      ))
                    : <Badge variant="secondary">无</Badge>}
                </TableCell>
                <TableCell className="text-center">
                  {item.minister.length > 0
                    ? (
                        <>
                          {item.minister.slice(0, 5).map(item => (
                            <Badge key={item.QQID} variant="secondary">{item.nickname}</Badge>
                          ))}
                          {item.minister.length > 5 && <Badge variant="secondary">...</Badge>}
                        </>
                      )
                    : <Badge variant="secondary">无</Badge>}
                </TableCell>
                <TableCell className="text-center">
                  <Badge asChild>
                    <Link href={`/department/${item.code}`}>
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
    </Card>
  )
}

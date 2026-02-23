import type { Department } from "@/src/models/department"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ({
  department,
}: {
  department: Department
}) {
  const members = department.member
  const ministers = department.minister

  return (
    <Card>
      <CardHeader>
        <CardTitle>部门信息</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup className="grid grid-cols-2">
          <Field>
            <FieldLabel>部门名称</FieldLabel>
            <Input
              value={department.name}
              readOnly
            />
          </Field>
          <Field>
            <FieldLabel>部门代码</FieldLabel>
            <Input
              value={department.code}
              readOnly
            />
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">序号</TableHead>
                <TableHead className="text-center">昵称</TableHead>
                <TableHead className="text-center">游戏 ID</TableHead>
                <TableHead className="text-center">QQ 号</TableHead>
                <TableHead className="text-center">部门</TableHead>
                <TableHead className="text-center">部长</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((item, index) => (
                <TableRow key={item.QQID}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">{item.nickname}</TableCell>
                  <TableCell className="text-center">{item.mcName ?? "无"}</TableCell>
                  <TableCell className="text-center">{item.QQID}</TableCell>
                  <TableCell className="text-center">
                    {item.departments.length > 0
                      ? item.departments.map(i => (
                          <Badge
                            key={i.code}
                            variant={i.code === department.code ? "destructive" : "secondary"}
                          >
                            {i.name}
                          </Badge>
                        ))
                      : <Badge variant="secondary">无</Badge>}
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={ministers.map(i => i.QQID).includes(item.QQID)}
                      aria-readonly
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

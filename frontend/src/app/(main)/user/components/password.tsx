"use client"

import type { ChangePasswordRequest } from "@/src/schema/user"
import { IconArrowLeft, IconUpload } from "@tabler/icons-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { changePassword } from "@/src/apis/user"

export default function ({
  isOpen,
  onClose,
  logout,
}: {
  isOpen: boolean
  onClose: () => void
  logout: () => void
}) {
  const [formData, setFormData] = useState<ChangePasswordRequest>({
    old: "",
    new: "",
  })

  const handleSubmit = () => {
    if (!formData.old || !formData.new)
      return

    changePassword(formData)
      .then(() => {
        toast.success("密码修改成功")
        logout()
      })
      .catch((error) => {
        switch (error.code) {
          case "INVALID_OLD_PASSWORD":
            toast.error("旧密码错误")
            break
          case "SAME_AS_OLD_PASSWORD":
            toast.error("新密码不能与旧密码相同")
            break
          default:
            toast.error("密码修改失败")
        }
      })
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>修改密码</DialogTitle>
        </DialogHeader>
        <form className="w-full flex">
          <FieldGroup className="grid grid-cols-2">
            <Field>
              <FieldLabel>旧密码</FieldLabel>
              <Input
                value={formData.old}
                onInput={e =>
                  setFormData(v => ({
                    ...v,
                    old: (e.target as HTMLInputElement).value,
                  }))}
              />
            </Field>
            <Field>
              <FieldLabel>新密码</FieldLabel>
              <Input
                value={formData.new}
                onInput={e =>
                  setFormData(v => ({
                    ...v,
                    new: (e.target as HTMLInputElement).value,
                  }))}
              />
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter className="justify-end gap-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            <IconArrowLeft />
            取消
          </Button>
          <Button onClick={handleSubmit}>
            <IconUpload />
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

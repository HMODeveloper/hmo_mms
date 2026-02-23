"use client"

import { IconArrowLeft, IconUpload } from "@tabler/icons-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { resetPassword } from "@/src/apis/member"

export default function ({
  QQID,
  isOpen,
  onClose,
}: {
  QQID: string
  isOpen: boolean
  onClose: () => void
}) {
  const handleSubmit = () => {
    resetPassword(QQID)
      .then(() => {
        toast.success("密码已重置")
        onClose()
      })
      .catch((error) => {
        switch (error.code) {
          case "USER_NOT_FOUND":
            toast.error("用户不存在.")
            break
          case "ADMIN_REQUIRED":
            toast.error("需要管理员权限.")
            break
          default:
            toast.error("密码重置失败, 请稍后再试.")
        }
      })
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>重置密码</DialogTitle>
        </DialogHeader>
        <DialogFooter className="justify-end gap-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            <IconArrowLeft />
            取消
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <IconUpload />
                重置
              </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>确认重置</DialogTitle>
                <DialogDescription>
                  此操作无法恢复!
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="justify-end gap-4">
                <DialogClose asChild>
                  <Button variant="outline">
                    <IconArrowLeft />
                    我再想想
                  </Button>
                </DialogClose>
                <Button onClick={handleSubmit}>
                  <IconUpload />
                  我知道我在做什么!
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

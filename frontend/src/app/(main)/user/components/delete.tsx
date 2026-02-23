"use client"

import { IconArrowLeft, IconX } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
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
import { removeUser } from "@/src/apis/user"

export default function ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const router = useRouter()

  const handleSubmit = () => {
    removeUser()
      .then(() => {
        toast.success("用户已注销, 请联系管理员.")
        router.push("/")
      })
      .catch((error) => {
        switch (error.code) {
          case "USER_NOT_FOUND":
            toast.error("用户不存在.")
            break
          case "SUPERADMIN_REQUIRED":
            toast.error("工作人员请联系超级管理员注销.")
            break
          default:
            toast.error("注销失败, 请稍后再试.")
        }
      })
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>用户注销</DialogTitle>
          <DialogDescription>
            你的账号将会永久消失! (真的很久!)
          </DialogDescription>
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
              <Button variant="destructive">
                <IconX />
                删除
              </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>确认注销</DialogTitle>
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
                <Button
                  variant="destructive"
                  onClick={handleSubmit}
                >
                  <IconX />
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

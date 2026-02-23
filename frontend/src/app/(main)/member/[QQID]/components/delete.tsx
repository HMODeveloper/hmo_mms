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
import { removeMember } from "@/src/apis/member"
import { useAppData } from "@/src/stores/app"

export default function ({
  QQID,
  isOpen,
  onClose,
}: {
  QQID: string
  isOpen: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const { updateMembers } = useAppData()

  const handleSubmit = () => {
    removeMember(QQID)
      .then(() => {
        toast.success("用户已删除.")
        router.push("/member")
        void updateMembers()
      })
      .catch((error) => {
        switch (error.code) {
          case "USER_NOT_FOUND":
            toast.error("用户不存在.")
            break
          case "ADMIN_REQUIRED":
            toast.error("需要管理员权限.")
            break
          case "SUPERADMIN_REQUIRED":
            toast.error("需要超级管理员权限.")
            break
          default:
            toast.error("删除失败, 请稍后再试.")
        }
      })
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>删除用户</DialogTitle>
          <DialogDescription>
            确定要删除该用户吗? (真的很久!)
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

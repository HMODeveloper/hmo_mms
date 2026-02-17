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
import { useMember } from "@/src/stores/members"

export default function DeleteModal({
  QQID,
  isOpen,
  onClose,
}: {
  QQID: string
  isOpen: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const { update } = useMember()

  const handleSubmit = () => {
    removeMember(QQID)
      .then(() => {
        toast.success("用户已删除.")
        router.push("/member")
        void update()
      })
      .catch(() => {
        toast.error("用户删除失败")
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

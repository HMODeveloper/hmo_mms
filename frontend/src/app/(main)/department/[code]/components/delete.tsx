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
import { removeDepartment } from "@/src/apis/department"

export default function ({
  code,
  isOpen,
  onClose,
  onChange,
}: {
  code: string
  isOpen: boolean
  onClose: () => void
  onChange: () => Promise<void>
}) {
  const router = useRouter()

  const handleSubmit = () => {
    removeDepartment(code)
      .then(() => {
        toast.success("部门删除成功.")
        router.push("/department")
        void onChange()
      })
      .catch((error) => {
        switch (error.code) {
          case "DEPT_NOT_FOUND":
            toast.error("部门不存在.")
            break
          case "DEPT_NOT_EMPTY":
            toast.error("部门不为空.")
            break
          case "SUPERADMIN_REQUIRED":
            toast.error("需要超级管理员权限.")
            break
          default:
            toast.error("部门删除失败.")
        }
      })
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>删除部门</DialogTitle>
          <DialogDescription>
            确定要删除该部门吗? (真的很久!)
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
                <DialogTitle>确认删除</DialogTitle>
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

<script setup lang="ts">
import type { MemberInfo } from "~/apis/member"
import type { ColumnDef } from "@tanstack/vue-table"
import dayjs from "dayjs"

const props = defineProps<{
  memberList: MemberInfo[]
}>()

const data = computed(() => props.memberList)

const columns: ColumnDef<MemberInfo>[] = [
  {
    accessorKey: "QQID",
    header: "QQ 号",
    cell: ({ row }) => row.getValue("QQID"),
  },
  {
    accessorKey: "nickname",
    header: "昵称",
    cell: ({ row }) => row.getValue("nickname"),
  },
  {
    accessorKey: "MCName",
    header: "游戏 ID",
    cell: ({ row }) => row.getValue("MCName"),
  },
  {
    accessorKey: "createAt",
    header: "入库时间",
    cell: ({ row }) => dayjs(row.getValue("createAt")).format("YYYY-MM-DD"),
  },
  {
    accessorKey: "realName",
    header: "真实姓名",
    cell: ({ row }) => row.getValue("realName"),
  },
  {
    accessorKey: "studentID",
    header: "学号",
    cell: ({ row }) => row.getValue("studentID"),
  },
  {
    accessorKey: "collegeName",
    header: "学院",
    cell: ({ row }) => row.getValue("collegeName"),
  },
  {
    accessorKey: "majorClass",
    header: "专业班级",
    cell: ({ row }) => {
      const member = data.value.find(item => item.QQID === row.getValue("QQID"))
      if (!member) return "---"
      if (!(member.major && member.grade && member.classIndex)) return "***"

      const yy = member.grade.toString().slice(-2)
      const index = member.classIndex.toString().padStart(2, "0")
      return `${member.major}${yy}${index}`
    },
  },
  {
    accessorKey: "departments",
    header: "任职部门",
    cell: ({ row }) => {
      const member = data.value.find(item => item.QQID === row.getValue("QQID"))
      return member?.departments.map(item => item.name).join(", ") || "无"
    },
  },
  {
    accessorKey: "level",
    header: "等级",
    cell: ({ row }) => row.getValue("level"),
  },
]
</script>

<template>
  <BaseSection
    title="成员列表"
    icon="i-tabler-table-heart"
  >
    <UTable
      sticky
      :data="data"
      :columns="columns"
      class="w-full"
    />
  </BaseSection>
</template>

<style scoped>

</style>

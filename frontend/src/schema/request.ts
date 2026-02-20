export interface UpdateMemberInfoRequest {
  nickname?: string
  mcName?: string
  realName?: string
  studentID?: string
  college?: string
  school?: string
  major?: string
  grade?: number
  classIndex?: number
}

export interface AddMemberRequest {
  QQID: string
  nickname: string
  password: string
  mcName?: string
  realName: string
  studentID?: string
  college: string
  school?: string
  major?: string
  grade?: number
  classIndex?: number
}

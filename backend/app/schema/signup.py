from typing import Optional

from pydantic import BaseModel, Field


class CollegeInfo(BaseModel):
    name: str
    code: str


class SignUpInfoResponse(BaseModel):
    colleges: list[CollegeInfo]


class SignUpRequest(BaseModel):
    qq_id: int = Field(..., alias="QQID")
    nickname: str
    password: str
    mc_name: Optional[str] = Field(..., alias="mcName")
    real_name: str = Field(..., alias="realName")
    student_id: Optional[str] = Field(..., alias="studentId")
    college: str
    # 这里改为直接传递 code, 后端根据 code 查找学院, 查找不到409报错
    school: Optional[str]
    major: Optional[str]
    grade: Optional[int]
    class_index: Optional[int] = Field(..., alias="classIndex")

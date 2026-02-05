from pydantic import BaseModel


class CollegeInfo(BaseModel):
    name: str
    code: str


class SignUpInfoResponse(BaseModel):
    colleges: list[CollegeInfo]


class SignUpRequest(BaseModel):
    qq_id: int
    nickname: str
    password: str
    mc_name: str
    real_name: str
    student_id: str
    college_name: str
    major: str
    grade: int
    class_index: int

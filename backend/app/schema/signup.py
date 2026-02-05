from pydantic import BaseModel


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

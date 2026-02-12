from app.model import College
from app.schema import BaseCollegeInfo
from app.schema.public import CollegeListResponse


async def college_list_handler() -> CollegeListResponse:
    college_list = []
    for college in College:
        college_list.append(
            BaseCollegeInfo(
                code=college.name,
                name=str(college.value),
            )
        )

    return college_list

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReportCreate(BaseModel):
    title:       str
    report_type: str
    notes:       Optional[str] = None

class ReportResponse(BaseModel):
    id:           int
    report_id:    Optional[str]
    title:        str
    report_type:  str
    status:       str
    generated_by_id: Optional[int]
    notes:        Optional[str]
    created_at:   Optional[datetime]

    class Config:
        from_attributes = True
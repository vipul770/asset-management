from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class MaintenanceCreate(BaseModel):
    asset_id:       int
    issue:          str
    priority:       Optional[str]  = 'medium'
    assigned_to_id: Optional[int]  = None
    reported_date:  Optional[date] = None
    due_date:       Optional[date] = None
    notes:          Optional[str]  = None

class MaintenanceUpdate(BaseModel):
    issue:          Optional[str]  = None
    priority:       Optional[str]  = None
    status:         Optional[str]  = None
    assigned_to_id: Optional[int]  = None
    reported_date:  Optional[date] = None
    due_date:       Optional[date] = None
    completed_date: Optional[date] = None
    notes:          Optional[str]  = None

class MaintenanceResponse(BaseModel):
    id:             int
    maintenance_id: Optional[str]
    asset_id:       int
    issue:          str
    priority:       str
    status:         str
    assigned_to_id: Optional[int]
    reported_by_id: Optional[int]
    reported_date:  Optional[date]
    due_date:       Optional[date]
    completed_date: Optional[date]
    notes:          Optional[str]
    created_at:     Optional[datetime]

    class Config:
        from_attributes = True
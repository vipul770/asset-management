from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CategoryCreate(BaseModel):
    name:        str
    icon:        Optional[str] = None
    description: Optional[str] = None
    color:       Optional[str] = None

class CategoryUpdate(BaseModel):
    name:        Optional[str] = None
    icon:        Optional[str] = None
    description: Optional[str] = None
    color:       Optional[str] = None

class CategoryResponse(BaseModel):
    id:          int
    name:        str
    icon:        Optional[str]
    description: Optional[str]
    color:       Optional[str]
    created_at:  Optional[datetime]

    class Config:
        from_attributes = True
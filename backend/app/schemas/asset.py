from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from decimal import Decimal

class AssetCreate(BaseModel):
    asset_id:        str
    name:            str
    category_id:     Optional[int]     = None
    serial_number:   Optional[str]     = None
    vendor:          Optional[str]     = None
    condition:       Optional[str]     = 'new'
    status:          Optional[str]     = 'available'
    location:        Optional[str]     = None
    assigned_to_id:  Optional[int]     = None
    purchase_date:   Optional[date]    = None
    purchase_price:  Optional[Decimal] = None
    warranty_months: Optional[int]     = None
    description:     Optional[str]     = None

class AssetUpdate(BaseModel):
    name:            Optional[str]     = None
    category_id:     Optional[int]     = None
    serial_number:   Optional[str]     = None
    vendor:          Optional[str]     = None
    condition:       Optional[str]     = None
    status:          Optional[str]     = None
    location:        Optional[str]     = None
    assigned_to_id:  Optional[int]     = None
    purchase_date:   Optional[date]    = None
    purchase_price:  Optional[Decimal] = None
    warranty_months: Optional[int]     = None
    description:     Optional[str]     = None

class AssetResponse(BaseModel):
    id:              int
    asset_id:        str
    name:            str
    category_id:     Optional[int]
    serial_number:   Optional[str]
    vendor:          Optional[str]
    condition:       str
    status:          str
    location:        Optional[str]
    assigned_to_id:  Optional[int]
    purchase_date:   Optional[date]
    purchase_price:  Optional[Decimal]
    warranty_months: Optional[int]
    description:     Optional[str]
    image:           Optional[str]
    created_at:      Optional[datetime]

    class Config:
        from_attributes = True
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

class RegisterSchema(BaseModel):
    first_name:       str
    last_name:        str
    email:            EmailStr
    phone:            Optional[str] = None
    password:         str
    confirm_password: str

class LoginSchema(BaseModel):
    email:    EmailStr
    password: str

class UserUpdate(BaseModel):
    first_name:   Optional[str]  = None
    last_name:    Optional[str]  = None
    phone:        Optional[str]  = None
    department:   Optional[str]  = None
    location:     Optional[str]  = None
    joining_date: Optional[date] = None
    notes:        Optional[str]  = None

class UserResponse(BaseModel):
    id:           int
    employee_id:  Optional[str]
    organization_id: str
    first_name:   str
    last_name:    str
    username:     str
    email:        str
    phone:        Optional[str]
    role:         str
    department:   Optional[str]
    location:     Optional[str]
    is_active:    bool
    created_at:   Optional[datetime]

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access:  str
    refresh: str



class AddUserSchema(BaseModel):
    first_name:       str
    last_name:        str
    email:            EmailStr
    phone:            Optional[str] = None

    employee_id:      str
    role:             str

    department:       Optional[str] = None
    location:         Optional[str] = None
    joining_date:     Optional[date] = None
    notes:            Optional[str] = None

    password:         str
    confirm_password: str




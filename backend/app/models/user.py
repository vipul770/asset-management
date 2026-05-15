from sqlalchemy import Column, Integer, String, Boolean, Date, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = 'users'

    id           = Column(Integer, primary_key=True, index=True)
    organization_id  = Column(String(50), unique=True, index=True, nullable=False)
    employee_id  = Column(String(20), unique=True, nullable=True)
    first_name   = Column(String(100))
    last_name    = Column(String(100))
    username     = Column(String(100), unique=True, index=True)
    email        = Column(String(200), unique=True, index=True)
    phone        = Column(String(20), nullable=True)
    password     = Column(String(255))
    role         = Column(String(20), default='employee')
    department   = Column(String(100), nullable=True)
    location     = Column(String(100), nullable=True)
    joining_date = Column(Date, nullable=True)
    avatar       = Column(String(255), nullable=True)
    notes        = Column(Text, nullable=True)
    is_active    = Column(Boolean, default=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())
    updated_at   = Column(DateTime(timezone=True), onupdate=func.now())
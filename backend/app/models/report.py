from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Report(Base):
    __tablename__ = 'reports'

    id           = Column(Integer, primary_key=True, index=True)
    report_id    = Column(String(20), unique=True, index=True)
    title        = Column(String(200))
    report_type  = Column(String(20))
    status       = Column(String(20), default='processing')
    generated_by_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    file         = Column(String(255), nullable=True)
    notes        = Column(Text, nullable=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())
    updated_at   = Column(DateTime(timezone=True), onupdate=func.now())

    generated_by = relationship('User', foreign_keys=[generated_by_id])
from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class MaintenanceRequest(Base):
    __tablename__ = 'maintenance_requests'

    id              = Column(Integer, primary_key=True, index=True)
    maintenance_id  = Column(String(20), unique=True, index=True)
    asset_id        = Column(Integer, ForeignKey('assets.id'))
    issue           = Column(Text)
    priority        = Column(String(20), default='medium')
    status          = Column(String(20), default='pending')
    assigned_to_id  = Column(Integer, ForeignKey('users.id'), nullable=True)
    reported_by_id  = Column(Integer, ForeignKey('users.id'), nullable=True)
    reported_date   = Column(Date, nullable=True)
    due_date        = Column(Date, nullable=True)
    completed_date  = Column(Date, nullable=True)
    notes           = Column(Text, nullable=True)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    updated_at      = Column(DateTime(timezone=True), onupdate=func.now())

    asset       = relationship('Asset', back_populates='maintenance')
    assigned_to = relationship('User', foreign_keys=[assigned_to_id])
    reported_by = relationship('User', foreign_keys=[reported_by_id])
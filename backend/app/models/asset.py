from sqlalchemy import Column, Integer, String, Text, Date, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Asset(Base):
    __tablename__ = 'assets'

    id             = Column(Integer, primary_key=True, index=True)
    asset_id       = Column(String(20), unique=True, index=True)
    name           = Column(String(200))
    category_id    = Column(Integer, ForeignKey('categories.id'), nullable=True)
    serial_number  = Column(String(100), nullable=True)
    vendor         = Column(String(100), nullable=True)
    condition      = Column(String(20), default='new')
    status         = Column(String(20), default='available')
    location       = Column(String(100), nullable=True)
    assigned_to_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    purchase_date  = Column(Date, nullable=True)
    purchase_price = Column(Numeric(10, 2), nullable=True)
    warranty_months= Column(Integer, nullable=True)
    description    = Column(Text, nullable=True)
    image          = Column(String(255), nullable=True)
    created_at     = Column(DateTime(timezone=True), server_default=func.now())
    updated_at     = Column(DateTime(timezone=True), onupdate=func.now())

    category    = relationship('Category', back_populates='assets')
    assigned_to = relationship('User', foreign_keys=[assigned_to_id])
    maintenance = relationship('MaintenanceRequest', back_populates='asset')
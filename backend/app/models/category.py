from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Category(Base):
    __tablename__ = 'categories'

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(100), unique=True, index=True)
    icon        = Column(String(10), nullable=True)
    description = Column(Text, nullable=True)
    color       = Column(String(100), nullable=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    updated_at  = Column(DateTime(timezone=True), onupdate=func.now())

    assets = relationship('Asset', back_populates='category')
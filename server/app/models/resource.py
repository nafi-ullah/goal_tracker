from sqlalchemy import Column, Integer, String, Text, Interval, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Resource(Base):
    __tablename__ = "resources"
    
    resource_id = Column(Integer, primary_key=True, index=True)
    resource_type = Column(String(50))
    title = Column(String(255), nullable=False)
    value_per_unit = Column(Integer, default=0)
    total_time_per_unit = Column(Interval)
    resource_link = Column(String(500))
    note = Column(Text)
    goal_id = Column(Integer, ForeignKey("goals.goal_id", ondelete="CASCADE"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    goal = relationship("Goal", back_populates="resources")
    topics = relationship("ResourceTopic", back_populates="resource", cascade="all, delete-orphan")

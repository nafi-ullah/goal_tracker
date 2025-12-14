from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class ResourceTopic(Base):
    __tablename__ = "resource_topics"
    
    topic_id = Column(Integer, primary_key=True, index=True)
    resource_id = Column(Integer, ForeignKey("resources.resource_id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    point_multiplier = Column(Float, default=1.0)
    is_completed = Column(Boolean, default=False)
    is_skipped = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    resource = relationship("Resource", back_populates="topics")

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TopicBase(BaseModel):
    title: str
    point_multiplier: Optional[float] = 1.0
    is_completed: Optional[bool] = False
    is_skipped: Optional[bool] = False
    complete_date: Optional[datetime] = None

class TopicCreate(TopicBase):
    resource_id: int

class TopicUpdate(BaseModel):
    title: Optional[str] = None
    point_multiplier: Optional[float] = None
    is_completed: Optional[bool] = None
    is_skipped: Optional[bool] = None
    complete_date: Optional[datetime] = None

class TopicStatusUpdate(BaseModel):
    is_completed: Optional[bool] = None
    is_skipped: Optional[bool] = None

class TopicResponse(TopicBase):
    topic_id: int
    resource_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class BulkTopicCreate(BaseModel):
    resource_id: int
    topics: List[TopicBase]

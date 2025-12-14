from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta

class ResourceBase(BaseModel):
    resource_type: Optional[str] = None
    title: str
    value_per_unit: Optional[int] = 0
    total_time_per_unit: Optional[str] = None
    resource_link: Optional[str] = None
    note: Optional[str] = None

class ResourceCreate(ResourceBase):
    goal_id: int

class ResourceUpdate(BaseModel):
    resource_type: Optional[str] = None
    title: Optional[str] = None
    value_per_unit: Optional[int] = None
    total_time_per_unit: Optional[str] = None
    resource_link: Optional[str] = None
    note: Optional[str] = None

class ResourceResponse(ResourceBase):
    resource_id: int
    goal_id: int
    created_at: datetime

    class Config:
        from_attributes = True

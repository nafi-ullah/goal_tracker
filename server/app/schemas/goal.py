from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class GoalBase(BaseModel):
    title: str
    description: Optional[str] = None
    reward_type: Optional[str] = None
    target_value: Optional[float] = None
    initial_value: Optional[float] = 0
    domain_name: Optional[str] = None

class GoalCreate(GoalBase):
    user_id: int

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    reward_type: Optional[str] = None
    target_value: Optional[float] = None
    initial_value: Optional[float] = None
    domain_name: Optional[str] = None

class GoalResponse(GoalBase):
    goal_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Nested schemas for detailed goal response
class TopicDetail(BaseModel):
    topic_id: int
    title: str
    point_multiplier: float
    is_completed: bool
    is_skipped: bool
    topic_point_value: float
    created_at: datetime

    class Config:
        from_attributes = True

class ResourceDetail(BaseModel):
    resource_id: int
    resource_type: Optional[str]
    title: str
    value_per_unit: int
    total_time_per_unit: Optional[str]
    resource_link: Optional[str]
    note: Optional[str]
    total_topic_points: float
    completed_points_resources: float
    topics: List[TopicDetail]
    created_at: datetime

    class Config:
        from_attributes = True

class GoalDetailResponse(GoalBase):
    goal_id: int
    user_id: int
    goals_total_points: float
    increment_goal_value_per_point: float
    completed_points_goal: float
    current_goal_value: float
    resources: List[ResourceDetail]
    created_at: datetime

    class Config:
        from_attributes = True

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.goal import GoalCreate, GoalUpdate, GoalResponse, GoalDetailResponse
from app.controllers.goal_controller import GoalController
from typing import List

router = APIRouter()

@router.post("/", response_model=GoalResponse)
def create_goal(goal: GoalCreate, db: Session = Depends(get_db)):
    """Create a new goal"""
    return GoalController.create_goal(db, goal)

@router.get("/user/{user_id}", response_model=List[GoalResponse])
def get_goals_by_user(user_id: int, db: Session = Depends(get_db)):
    """Get all goals for a user"""
    return GoalController.get_goals_by_user(db, user_id)

@router.get("/user/{user_id}/details", response_model=List[GoalDetailResponse])
def get_goals_with_details(user_id: int, db: Session = Depends(get_db)):
    """Get all goals with resources and topics for a user (nested structure with calculated fields)"""
    return GoalController.get_goals_with_details(db, user_id)

@router.get("/{goal_id}", response_model=GoalResponse)
def get_goal(goal_id: int, db: Session = Depends(get_db)):
    """Get goal by ID"""
    return GoalController.get_goal(db, goal_id)

@router.put("/{goal_id}", response_model=GoalResponse)
def update_goal(goal_id: int, goal_update: GoalUpdate, db: Session = Depends(get_db)):
    """Update goal"""
    return GoalController.update_goal(db, goal_id, goal_update)

@router.delete("/{goal_id}")
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    """Delete goal"""
    return GoalController.delete_goal(db, goal_id)

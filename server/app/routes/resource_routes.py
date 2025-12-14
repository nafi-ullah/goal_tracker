from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.resource import ResourceCreate, ResourceUpdate, ResourceResponse
from app.controllers.resource_controller import ResourceController
from typing import List

router = APIRouter()

@router.post("/", response_model=ResourceResponse)
def create_resource(resource: ResourceCreate, db: Session = Depends(get_db)):
    """Create a new resource"""
    return ResourceController.create_resource(db, resource)

@router.get("/goal/{goal_id}", response_model=List[ResourceResponse])
def get_resources_by_goal(goal_id: int, db: Session = Depends(get_db)):
    """Get all resources for a goal"""
    return ResourceController.get_resources_by_goal(db, goal_id)

@router.get("/{resource_id}", response_model=ResourceResponse)
def get_resource(resource_id: int, db: Session = Depends(get_db)):
    """Get resource by ID"""
    return ResourceController.get_resource(db, resource_id)

@router.put("/{resource_id}", response_model=ResourceResponse)
def update_resource(resource_id: int, resource_update: ResourceUpdate, db: Session = Depends(get_db)):
    """Update resource"""
    return ResourceController.update_resource(db, resource_id, resource_update)

@router.delete("/{resource_id}")
def delete_resource(resource_id: int, db: Session = Depends(get_db)):
    """Delete resource"""
    return ResourceController.delete_resource(db, resource_id)

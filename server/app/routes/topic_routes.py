from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.topic import TopicCreate, TopicUpdate, TopicResponse, BulkTopicCreate, TopicStatusUpdate
from app.controllers.topic_controller import TopicController
from typing import List

router = APIRouter()

@router.post("/", response_model=TopicResponse)
def create_topic(topic: TopicCreate, db: Session = Depends(get_db)):
    """Create a new topic"""
    return TopicController.create_topic(db, topic)

@router.post("/bulk", response_model=List[TopicResponse])
def bulk_create_topics(bulk_data: BulkTopicCreate, db: Session = Depends(get_db)):
    """Create multiple topics for a resource in one call"""
    return TopicController.bulk_create_topics(db, bulk_data)

@router.get("/resource/{resource_id}", response_model=List[TopicResponse])
def get_topics_by_resource(resource_id: int, db: Session = Depends(get_db)):
    """Get all topics for a resource"""
    return TopicController.get_topics_by_resource(db, resource_id)

@router.get("/{topic_id}", response_model=TopicResponse)
def get_topic(topic_id: int, db: Session = Depends(get_db)):
    """Get topic by ID"""
    return TopicController.get_topic(db, topic_id)

@router.put("/{topic_id}", response_model=TopicResponse)
def update_topic(topic_id: int, topic_update: TopicUpdate, db: Session = Depends(get_db)):
    """Update topic"""
    return TopicController.update_topic(db, topic_id, topic_update)

@router.patch("/{topic_id}/status", response_model=TopicResponse)
def update_topic_status(topic_id: int, status_update: TopicStatusUpdate, db: Session = Depends(get_db)):
    """Update topic's completion and skipped status"""
    return TopicController.update_topic_status(db, topic_id, status_update)

@router.delete("/{topic_id}")
def delete_topic(topic_id: int, db: Session = Depends(get_db)):
    """Delete topic"""
    return TopicController.delete_topic(db, topic_id)

from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.topic import ResourceTopic
from app.schemas.topic import TopicCreate, TopicUpdate, BulkTopicCreate, TopicStatusUpdate
from typing import List
from datetime import datetime

class TopicController:
    @staticmethod
    def create_topic(db: Session, topic: TopicCreate):
        db_topic = ResourceTopic(**topic.model_dump())
        db.add(db_topic)
        db.commit()
        db.refresh(db_topic)
        return db_topic
    
    @staticmethod
    def bulk_create_topics(db: Session, bulk_data: BulkTopicCreate):
        """Create multiple topics for a resource in one call"""
        db_topics = []
        for topic_data in bulk_data.topics:
            db_topic = ResourceTopic(
                resource_id=bulk_data.resource_id,
                **topic_data.model_dump()
            )
            db.add(db_topic)
            db_topics.append(db_topic)
        
        db.commit()
        for topic in db_topics:
            db.refresh(topic)
        
        return db_topics
    
    @staticmethod
    def get_topics_by_resource(db: Session, resource_id: int):
        topics = db.query(ResourceTopic).filter(ResourceTopic.resource_id == resource_id).all()
        return topics
    
    @staticmethod
    def get_topic(db: Session, topic_id: int):
        topic = db.query(ResourceTopic).filter(ResourceTopic.topic_id == topic_id).first()
        if not topic:
            raise HTTPException(status_code=404, detail="Topic not found")
        return topic
    
    @staticmethod
    def update_topic(db: Session, topic_id: int, topic_update: TopicUpdate):
        topic = db.query(ResourceTopic).filter(ResourceTopic.topic_id == topic_id).first()
        if not topic:
            raise HTTPException(status_code=404, detail="Topic not found")
        
        update_data = topic_update.model_dump(exclude_unset=True)
        
        # If is_completed is being set to True, automatically set complete_date
        if "is_completed" in update_data and update_data["is_completed"] == True:
            if not topic.is_completed:  # Only set if it wasn't already completed
                update_data["complete_date"] = datetime.now()
        # If is_completed is being set to False, clear complete_date
        elif "is_completed" in update_data and update_data["is_completed"] == False:
            update_data["complete_date"] = None
        
        for key, value in update_data.items():
            setattr(topic, key, value)
        
        db.commit()
        db.refresh(topic)
        return topic
    
    @staticmethod
    def update_topic_status(db: Session, topic_id: int, status_update: TopicStatusUpdate):
        """Update topic's completion and skipped status"""
        topic = db.query(ResourceTopic).filter(ResourceTopic.topic_id == topic_id).first()
        if not topic:
            raise HTTPException(status_code=404, detail="Topic not found")
        
        update_data = status_update.model_dump(exclude_unset=True)
        
        # If is_completed is being set to True, automatically set complete_date
        if "is_completed" in update_data and update_data["is_completed"] == True:
            if not topic.is_completed:  # Only set if it wasn't already completed
                update_data["complete_date"] = datetime.now()
        # If is_completed is being set to False, clear complete_date
        elif "is_completed" in update_data and update_data["is_completed"] == False:
            update_data["complete_date"] = None
        
        for key, value in update_data.items():
            setattr(topic, key, value)
        
        db.commit()
        db.refresh(topic)
        return topic
    
    @staticmethod
    def delete_topic(db: Session, topic_id: int):
        topic = db.query(ResourceTopic).filter(ResourceTopic.topic_id == topic_id).first()
        if not topic:
            raise HTTPException(status_code=404, detail="Topic not found")
        
        db.delete(topic)
        db.commit()
        return {"message": "Topic deleted successfully"}

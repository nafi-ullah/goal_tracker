from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.resource import Resource
from app.schemas.resource import ResourceCreate, ResourceUpdate
from datetime import timedelta

class ResourceController:
    @staticmethod
    def create_resource(db: Session, resource: ResourceCreate):
        resource_data = resource.model_dump()
        
        # Convert time string to timedelta if provided
        if resource_data.get('total_time_per_unit'):
            time_str = resource_data['total_time_per_unit']
            # Parse time string (e.g., "30 minutes", "1 hour", "1:30:00")
            try:
                resource_data['total_time_per_unit'] = ResourceController._parse_time_string(time_str)
            except:
                resource_data['total_time_per_unit'] = None
        
        db_resource = Resource(**resource_data)
        db.add(db_resource)
        db.commit()
        db.refresh(db_resource)
        return db_resource
    
    @staticmethod
    def get_resources_by_goal(db: Session, goal_id: int):
        resources = db.query(Resource).filter(Resource.goal_id == goal_id).all()
        return resources
    
    @staticmethod
    def get_resource(db: Session, resource_id: int):
        resource = db.query(Resource).filter(Resource.resource_id == resource_id).first()
        if not resource:
            raise HTTPException(status_code=404, detail="Resource not found")
        return resource
    
    @staticmethod
    def update_resource(db: Session, resource_id: int, resource_update: ResourceUpdate):
        resource = db.query(Resource).filter(Resource.resource_id == resource_id).first()
        if not resource:
            raise HTTPException(status_code=404, detail="Resource not found")
        
        update_data = resource_update.model_dump(exclude_unset=True)
        
        # Convert time string to timedelta if provided
        if 'total_time_per_unit' in update_data and update_data['total_time_per_unit']:
            try:
                update_data['total_time_per_unit'] = ResourceController._parse_time_string(
                    update_data['total_time_per_unit']
                )
            except:
                update_data['total_time_per_unit'] = None
        
        for key, value in update_data.items():
            setattr(resource, key, value)
        
        db.commit()
        db.refresh(resource)
        return resource
    
    @staticmethod
    def delete_resource(db: Session, resource_id: int):
        resource = db.query(Resource).filter(Resource.resource_id == resource_id).first()
        if not resource:
            raise HTTPException(status_code=404, detail="Resource not found")
        
        db.delete(resource)
        db.commit()
        return {"message": "Resource deleted successfully"}
    
    @staticmethod
    def _parse_time_string(time_str: str) -> timedelta:
        """Parse time string to timedelta. Supports formats like '30 minutes', '1 hour', '1:30:00'"""
        time_str = time_str.strip().lower()
        
        # Handle "X minutes" or "X mins"
        if 'minute' in time_str or 'min' in time_str:
            minutes = int(''.join(filter(str.isdigit, time_str)))
            return timedelta(minutes=minutes)
        
        # Handle "X hours" or "X hrs"
        if 'hour' in time_str or 'hr' in time_str:
            hours = int(''.join(filter(str.isdigit, time_str)))
            return timedelta(hours=hours)
        
        # Handle "HH:MM:SS" or "HH:MM" format
        if ':' in time_str:
            parts = time_str.split(':')
            if len(parts) == 3:
                hours, minutes, seconds = map(int, parts)
                return timedelta(hours=hours, minutes=minutes, seconds=seconds)
            elif len(parts) == 2:
                hours, minutes = map(int, parts)
                return timedelta(hours=hours, minutes=minutes)
        
        # Default: try to parse as minutes
        try:
            minutes = int(time_str)
            return timedelta(minutes=minutes)
        except:
            raise ValueError(f"Cannot parse time string: {time_str}")

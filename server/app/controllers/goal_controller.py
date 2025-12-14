from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from app.models.goal import Goal
from app.models.resource import Resource
from app.models.topic import ResourceTopic
from app.schemas.goal import GoalCreate, GoalUpdate, GoalDetailResponse, ResourceDetail, TopicDetail
from typing import List

class GoalController:
    @staticmethod
    def create_goal(db: Session, goal: GoalCreate):
        db_goal = Goal(**goal.model_dump())
        db.add(db_goal)
        db.commit()
        db.refresh(db_goal)
        return db_goal
    
    @staticmethod
    def get_goals_by_user(db: Session, user_id: int):
        goals = db.query(Goal).filter(Goal.user_id == user_id).all()
        return goals
    
    @staticmethod
    def get_goal(db: Session, goal_id: int):
        goal = db.query(Goal).filter(Goal.goal_id == goal_id).first()
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
        return goal
    
    @staticmethod
    def update_goal(db: Session, goal_id: int, goal_update: GoalUpdate):
        goal = db.query(Goal).filter(Goal.goal_id == goal_id).first()
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        update_data = goal_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(goal, key, value)
        
        db.commit()
        db.refresh(goal)
        return goal
    
    @staticmethod
    def delete_goal(db: Session, goal_id: int):
        goal = db.query(Goal).filter(Goal.goal_id == goal_id).first()
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        db.delete(goal)
        db.commit()
        return {"message": "Goal deleted successfully"}
    
    @staticmethod
    def get_goals_with_details(db: Session, user_id: int) -> List[GoalDetailResponse]:
        goals = db.query(Goal).filter(Goal.user_id == user_id).options(
            joinedload(Goal.resources).joinedload(Resource.topics)
        ).all()
        
        result = []
        for goal in goals:
            # Calculate all metrics for the goal
            resources_detail = []
            goals_total_points = 0
            completed_points_goal = 0
            
            for resource in goal.resources:
                topics_detail = []
                total_topic_points = 0
                completed_points_resources = 0
                
                for topic in resource.topics:
                    # topic_point_value = resource value per unit * topic point multiplier
                    topic_point_value = resource.value_per_unit * topic.point_multiplier
                    total_topic_points += topic_point_value
                    
                    if topic.is_completed:
                        completed_points_resources += topic_point_value
                    
                    topics_detail.append(TopicDetail(
                        topic_id=topic.topic_id,
                        title=topic.title,
                        point_multiplier=topic.point_multiplier,
                        is_completed=topic.is_completed,
                        is_skipped=topic.is_skipped,
                        topic_point_value=topic_point_value,
                        created_at=topic.created_at
                    ))
                
                goals_total_points += total_topic_points
                completed_points_goal += completed_points_resources
                
                resources_detail.append(ResourceDetail(
                    resource_id=resource.resource_id,
                    resource_type=resource.resource_type,
                    title=resource.title,
                    value_per_unit=resource.value_per_unit,
                    total_time_per_unit=str(resource.total_time_per_unit) if resource.total_time_per_unit else None,
                    resource_link=resource.resource_link,
                    note=resource.note,
                    total_topic_points=total_topic_points,
                    completed_points_resources=completed_points_resources,
                    topics=topics_detail,
                    created_at=resource.created_at
                ))
            
            # Calculate increment_goal_value_per_point and current_goal_value
            if goals_total_points > 0:
                increment_goal_value_per_point = (goal.target_value - goal.initial_value) / goals_total_points
                current_goal_value = goal.initial_value + (completed_points_goal * increment_goal_value_per_point)
            else:
                increment_goal_value_per_point = 0
                current_goal_value = goal.initial_value
            
            result.append(GoalDetailResponse(
                goal_id=goal.goal_id,
                user_id=goal.user_id,
                title=goal.title,
                description=goal.description,
                reward_type=goal.reward_type,
                target_value=goal.target_value,
                initial_value=goal.initial_value,
                domain_name=goal.domain_name,
                goals_total_points=goals_total_points,
                increment_goal_value_per_point=increment_goal_value_per_point,
                completed_points_goal=completed_points_goal,
                current_goal_value=current_goal_value,
                resources=resources_detail,
                created_at=goal.created_at
            ))
        
        return result

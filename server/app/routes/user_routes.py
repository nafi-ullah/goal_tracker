from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserLogin, ChangePassword
from app.controllers.user_controller import UserController
from typing import List

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    """Create a new user account"""
    return UserController.create_user(db, user)

@router.post("/login", response_model=UserResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    return UserController.login(db, login_data)

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID"""
    return UserController.get_user(db, user_id)

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    """Update user profile (without password)"""
    return UserController.update_user(db, user_id, user_update)

@router.put("/{user_id}/change-password", response_model=UserResponse)
def change_password(user_id: int, password_data: ChangePassword, db: Session = Depends(get_db)):
    """Change user password"""
    return UserController.change_password(db, user_id, password_data)

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Delete user account"""
    return UserController.delete_user(db, user_id)

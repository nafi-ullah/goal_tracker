from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserLogin, ChangePassword

class UserController:
    @staticmethod
    def create_user(db: Session, user: UserCreate):
        # Check if email already exists
        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        db_user = User(**user.model_dump())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def login(db: Session, login_data: UserLogin):
        user = db.query(User).filter(User.email == login_data.email).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if user.password != login_data.password:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        return user
    
    @staticmethod
    def get_user(db: Session, user_id: int):
        user = db.query(User).filter(User.user_id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    
    @staticmethod
    def update_user(db: Session, user_id: int, user_update: UserUpdate):
        user = db.query(User).filter(User.user_id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        update_data = user_update.model_dump(exclude_unset=True)
        
        # Check if email is being updated and if it's already taken
        if "email" in update_data and update_data["email"] != user.email:
            existing_user = db.query(User).filter(User.email == update_data["email"]).first()
            if existing_user:
                raise HTTPException(status_code=400, detail="Email already registered")
        
        for key, value in update_data.items():
            setattr(user, key, value)
        
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def change_password(db: Session, user_id: int, password_data: ChangePassword):
        user = db.query(User).filter(User.user_id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if user.password != password_data.old_password:
            raise HTTPException(status_code=401, detail="Old password is incorrect")
        
        user.password = password_data.new_password
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def delete_user(db: Session, user_id: int):
        user = db.query(User).filter(User.user_id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        db.delete(user)
        db.commit()
        return {"message": "User deleted successfully"}

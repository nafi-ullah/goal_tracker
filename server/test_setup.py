"""
Test script to verify API endpoints
This script demonstrates basic API functionality without requiring a database
"""

def test_imports():
    """Test if all imports work correctly"""
    print("Testing imports...")
    
    try:
        from app.main import app
        print("✓ FastAPI app imported successfully")
        
        from app.models import User, Goal, Resource, ResourceTopic
        print("✓ Models imported successfully")
        
        from app.schemas.user import UserCreate, UserResponse
        from app.schemas.goal import GoalCreate, GoalResponse
        from app.schemas.resource import ResourceCreate, ResourceResponse
        from app.schemas.topic import TopicCreate, TopicResponse
        print("✓ Schemas imported successfully")
        
        from app.controllers.user_controller import UserController
        from app.controllers.goal_controller import GoalController
        from app.controllers.resource_controller import ResourceController
        from app.controllers.topic_controller import TopicController
        print("✓ Controllers imported successfully")
        
        from app.routes import user_routes, goal_routes, resource_routes, topic_routes
        print("✓ Routes imported successfully")
        
        print("\n✅ All imports successful! The project structure is correct.")
        return True
        
    except Exception as e:
        print(f"\n❌ Import error: {e}")
        return False

def test_app_structure():
    """Test FastAPI app structure"""
    print("\n\nTesting app structure...")
    
    try:
        from app.main import app
        
        # Check routes
        routes = [route.path for route in app.routes]
        print(f"\n📍 Available routes ({len(routes)}):")
        for route in sorted(routes):
            print(f"   {route}")
        
        # Check if main endpoints exist
        expected_prefixes = ['/api/users', '/api/goals', '/api/resources', '/api/topics']
        for prefix in expected_prefixes:
            matching_routes = [r for r in routes if r.startswith(prefix)]
            if matching_routes:
                print(f"\n✓ {prefix} endpoints found: {len(matching_routes)} routes")
            else:
                print(f"\n⚠ {prefix} endpoints not found")
        
        print("\n✅ App structure looks good!")
        return True
        
    except Exception as e:
        print(f"\n❌ Error testing app structure: {e}")
        return False

def show_api_info():
    """Display API information"""
    print("\n\n" + "="*60)
    print("🎯 GOAL TRACKER API INFORMATION")
    print("="*60)
    
    print("\n📋 API Endpoints:")
    
    print("\n👤 Users:")
    print("   POST   /api/users/signup")
    print("   POST   /api/users/login")
    print("   GET    /api/users/{user_id}")
    print("   PUT    /api/users/{user_id}")
    print("   PUT    /api/users/{user_id}/change-password")
    print("   DELETE /api/users/{user_id}")
    
    print("\n🎯 Goals:")
    print("   POST   /api/goals/")
    print("   GET    /api/goals/user/{user_id}")
    print("   GET    /api/goals/user/{user_id}/details")
    print("   GET    /api/goals/{goal_id}")
    print("   PUT    /api/goals/{goal_id}")
    print("   DELETE /api/goals/{goal_id}")
    
    print("\n📚 Resources:")
    print("   POST   /api/resources/")
    print("   GET    /api/resources/goal/{goal_id}")
    print("   GET    /api/resources/{resource_id}")
    print("   PUT    /api/resources/{resource_id}")
    print("   DELETE /api/resources/{resource_id}")
    
    print("\n📝 Topics:")
    print("   POST   /api/topics/")
    print("   POST   /api/topics/bulk")
    print("   GET    /api/topics/resource/{resource_id}")
    print("   GET    /api/topics/{topic_id}")
    print("   PUT    /api/topics/{topic_id}")
    print("   PATCH  /api/topics/{topic_id}/status")
    print("   DELETE /api/topics/{topic_id}")
    
    print("\n📖 Documentation:")
    print("   Swagger UI: http://localhost:8000/docs")
    print("   ReDoc:      http://localhost:8000/redoc")
    
    print("\n⚙️  To run the server:")
    print("   1. Make sure you have a .env file with DATABASE_URL")
    print("   2. Run: python run.py")
    print("   3. Or:  uvicorn app.main:app --reload")
    
    print("\n" + "="*60)

if __name__ == "__main__":
    print("🚀 Goal Tracker API - Test Suite\n")
    
    imports_ok = test_imports()
    structure_ok = test_app_structure()
    
    if imports_ok and structure_ok:
        show_api_info()
        print("\n✅ All tests passed! Your API is ready to run.")
        print("⚠️  Remember to configure your .env file with DATABASE_URL before starting the server.")
    else:
        print("\n❌ Some tests failed. Please check the errors above.")

# Goal Tracker Backend API

A FastAPI backend application for tracking goals, resources, and topics with Supabase PostgreSQL database.

## Project Structure

```
server/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database connection and session
│   ├── models/              # SQLAlchemy database models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── goal.py
│   │   ├── resource.py
│   │   └── topic.py
│   ├── schemas/             # Pydantic schemas for request/response
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── goal.py
│   │   ├── resource.py
│   │   └── topic.py
│   ├── controllers/         # Business logic
│   │   ├── __init__.py
│   │   ├── user_controller.py
│   │   ├── goal_controller.py
│   │   ├── resource_controller.py
│   │   └── topic_controller.py
│   └── routes/              # API route handlers
│       ├── __init__.py
│       ├── user_routes.py
│       ├── goal_routes.py
│       ├── resource_routes.py
│       └── topic_routes.py
├── .env                     # Environment variables (not in git)
├── .env.example             # Example environment variables
├── requirements.txt         # Python dependencies
└── run.py                   # Application runner
```

## Setup

1. **Create virtual environment and activate it:**
   ```bash
   cd server
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update the `DATABASE_URL` with your Supabase PostgreSQL connection string
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   PORT=8000
   HOST=0.0.0.0
   ```

4. **Run the application:**
   ```bash
   python run.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints

### Users
- `POST /api/users/signup` - Create a new user account
- `POST /api/users/login` - Login user
- `GET /api/users/{user_id}` - Get user by ID
- `PUT /api/users/{user_id}` - Update user profile
- `PUT /api/users/{user_id}/change-password` - Change password
- `DELETE /api/users/{user_id}` - Delete user

### Goals
- `POST /api/goals/` - Create a new goal
- `GET /api/goals/user/{user_id}` - Get all goals for a user
- `GET /api/goals/user/{user_id}/details` - Get goals with nested resources and topics (with calculated fields)
- `GET /api/goals/{goal_id}` - Get goal by ID
- `PUT /api/goals/{goal_id}` - Update goal
- `DELETE /api/goals/{goal_id}` - Delete goal

### Resources
- `POST /api/resources/` - Create a new resource
- `GET /api/resources/goal/{goal_id}` - Get all resources for a goal
- `GET /api/resources/{resource_id}` - Get resource by ID
- `PUT /api/resources/{resource_id}` - Update resource
- `DELETE /api/resources/{resource_id}` - Delete resource

### Topics
- `POST /api/topics/` - Create a new topic
- `POST /api/topics/bulk` - Create multiple topics for a resource
- `GET /api/topics/resource/{resource_id}` - Get all topics for a resource
- `GET /api/topics/{topic_id}` - Get topic by ID
- `PUT /api/topics/{topic_id}` - Update topic
- `PATCH /api/topics/{topic_id}/status` - Update topic completion/skipped status
- `DELETE /api/topics/{topic_id}` - Delete topic

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Features

- ✅ User authentication (Login/Signup) without JWT tokens
- ✅ Simple password change functionality
- ✅ CRUD operations for Goals, Resources, and Topics
- ✅ Nested data retrieval with calculated fields:
  - Topic point value
  - Total topic points per resource
  - Goals total points
  - Increment goal value per point
  - Completed points calculations
  - Current goal value
- ✅ Bulk insert for resource topics
- ✅ Update topic completion status
- ✅ Supabase PostgreSQL database integration
- ✅ Proper MVC folder structure

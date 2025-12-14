# API Usage Examples

This document provides examples of how to use the Goal Tracker API endpoints.

## Base URL
```
http://localhost:8000
```

## Authentication
This API does not use JWT tokens. User authentication is simple email/password based.

---

## 1. User Management

### Signup (Create New User)
```bash
curl -X POST "http://localhost:8000/api/users/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "mypassword",
    "phone": "+1234567890",
    "occupation": "Software Developer"
  }'
```

### Login
```bash
curl -X POST "http://localhost:8000/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "mypassword"
  }'
```

### Get User Profile
```bash
curl -X GET "http://localhost:8000/api/users/1"
```

### Update User Profile
```bash
curl -X PUT "http://localhost:8000/api/users/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "phone": "+9876543210"
  }'
```

### Change Password
```bash
curl -X PUT "http://localhost:8000/api/users/1/change-password" \
  -H "Content-Type: application/json" \
  -d '{
    "old_password": "mypassword",
    "new_password": "newsecurepassword"
  }'
```

---

## 2. Goals

### Create Goal
```bash
curl -X POST "http://localhost:8000/api/goals/" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "title": "Learn Python",
    "description": "Master Python programming",
    "reward_type": "Points",
    "target_value": 100,
    "initial_value": 0,
    "domain_name": "Programming"
  }'
```

### Get User's Goals
```bash
curl -X GET "http://localhost:8000/api/goals/user/1"
```

### Get Goals with Full Details (Nested Resources & Topics with Calculations)
```bash
curl -X GET "http://localhost:8000/api/goals/user/1/details"
```

This returns:
- All goals with their resources and topics
- Calculated fields:
  - `topic_point_value` for each topic
  - `total_topic_points` for each resource
  - `goals_total_points` for the goal
  - `increment_goal_value_per_point`
  - `completed_points_goal`
  - `current_goal_value`

### Update Goal
```bash
curl -X PUT "http://localhost:8000/api/goals/1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Master Python",
    "target_value": 150
  }'
```

### Delete Goal
```bash
curl -X DELETE "http://localhost:8000/api/goals/1"
```

---

## 3. Resources

### Create Resource
```bash
curl -X POST "http://localhost:8000/api/resources/" \
  -H "Content-Type: application/json" \
  -d '{
    "goal_id": 1,
    "resource_type": "Book",
    "title": "Python Crash Course",
    "value_per_unit": 10,
    "total_time_per_unit": "30 minutes",
    "resource_link": "https://example.com/book",
    "note": "Great beginner book"
  }'
```

### Get Resources by Goal
```bash
curl -X GET "http://localhost:8000/api/resources/goal/1"
```

### Update Resource
```bash
curl -X PUT "http://localhost:8000/api/resources/1" \
  -H "Content-Type: application/json" \
  -d '{
    "value_per_unit": 15,
    "note": "Updated note"
  }'
```

### Delete Resource
```bash
curl -X DELETE "http://localhost:8000/api/resources/1"
```

---

## 4. Topics

### Create Single Topic
```bash
curl -X POST "http://localhost:8000/api/topics/" \
  -H "Content-Type: application/json" \
  -d '{
    "resource_id": 1,
    "title": "Chapter 1: Getting Started",
    "point_multiplier": 1.0,
    "is_completed": false,
    "is_skipped": false
  }'
```

### Bulk Create Topics
```bash
curl -X POST "http://localhost:8000/api/topics/bulk" \
  -H "Content-Type: application/json" \
  -d '{
    "resource_id": 1,
    "topics": [
      {
        "title": "Chapter 1: Basics",
        "point_multiplier": 1.0
      },
      {
        "title": "Chapter 2: Variables",
        "point_multiplier": 1.2
      },
      {
        "title": "Chapter 3: Functions",
        "point_multiplier": 1.5
      }
    ]
  }'
```

### Get Topics by Resource
```bash
curl -X GET "http://localhost:8000/api/topics/resource/1"
```

### Update Topic
```bash
curl -X PUT "http://localhost:8000/api/topics/1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Chapter 1: Introduction to Python",
    "point_multiplier": 1.1
  }'
```

### Update Topic Status (Completion/Skipped)
```bash
curl -X PATCH "http://localhost:8000/api/topics/1/status" \
  -H "Content-Type: application/json" \
  -d '{
    "is_completed": true
  }'
```

When a topic is marked as completed, the goal's current value automatically increases by:
```
increment = resource.value_per_unit * topic.point_multiplier
```

### Delete Topic
```bash
curl -X DELETE "http://localhost:8000/api/topics/1"
```

---

## Complete Workflow Example

### 1. Create a User
```bash
curl -X POST "http://localhost:8000/api/users/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "pass123"
  }'
```

### 2. Create a Goal
```bash
curl -X POST "http://localhost:8000/api/goals/" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "title": "Learn Data Science",
    "reward_type": "Points",
    "target_value": 1000,
    "initial_value": 0
  }'
```

### 3. Add a Resource to the Goal
```bash
curl -X POST "http://localhost:8000/api/resources/" \
  -H "Content-Type: application/json" \
  -d '{
    "goal_id": 1,
    "resource_type": "Course",
    "title": "Data Science Bootcamp",
    "value_per_unit": 20
  }'
```

### 4. Bulk Add Topics to the Resource
```bash
curl -X POST "http://localhost:8000/api/topics/bulk" \
  -H "Content-Type: application/json" \
  -d '{
    "resource_id": 1,
    "topics": [
      {"title": "Week 1: Python Basics", "point_multiplier": 1.0},
      {"title": "Week 2: Data Analysis", "point_multiplier": 1.2},
      {"title": "Week 3: Machine Learning", "point_multiplier": 1.5}
    ]
  }'
```

### 5. Mark Topics as Completed
```bash
# Complete Week 1
curl -X PATCH "http://localhost:8000/api/topics/1/status" \
  -H "Content-Type: application/json" \
  -d '{"is_completed": true}'

# Complete Week 2
curl -X PATCH "http://localhost:8000/api/topics/2/status" \
  -H "Content-Type: application/json" \
  -d '{"is_completed": true}'
```

### 6. Get Full Goal Details with Calculations
```bash
curl -X GET "http://localhost:8000/api/goals/user/1/details"
```

This will return the goal with:
- Total points: 20 * (1.0 + 1.2 + 1.5) = 74 points
- Completed points: 20 * (1.0 + 1.2) = 44 points
- Increment per point: (1000 - 0) / 74 = 13.51
- Current value: 0 + (44 * 13.51) = 594.59

---

## Response Examples

### User Response
```json
{
  "user_id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "occupation": "Software Developer",
  "created_at": "2025-12-14T10:30:00Z"
}
```

### Goal with Full Details Response
```json
{
  "goal_id": 1,
  "user_id": 1,
  "title": "Learn Data Science",
  "description": null,
  "reward_type": "Points",
  "target_value": 1000,
  "initial_value": 0,
  "domain_name": null,
  "goals_total_points": 74,
  "increment_goal_value_per_point": 13.51,
  "completed_points_goal": 44,
  "current_goal_value": 594.59,
  "resources": [
    {
      "resource_id": 1,
      "resource_type": "Course",
      "title": "Data Science Bootcamp",
      "value_per_unit": 20,
      "total_time_per_unit": null,
      "resource_link": null,
      "note": null,
      "total_topic_points": 74,
      "completed_points_resources": 44,
      "topics": [
        {
          "topic_id": 1,
          "title": "Week 1: Python Basics",
          "point_multiplier": 1.0,
          "is_completed": true,
          "is_skipped": false,
          "topic_point_value": 20,
          "created_at": "2025-12-14T10:35:00Z"
        },
        {
          "topic_id": 2,
          "title": "Week 2: Data Analysis",
          "point_multiplier": 1.2,
          "is_completed": true,
          "is_skipped": false,
          "topic_point_value": 24,
          "created_at": "2025-12-14T10:35:00Z"
        },
        {
          "topic_id": 3,
          "title": "Week 3: Machine Learning",
          "point_multiplier": 1.5,
          "is_completed": false,
          "is_skipped": false,
          "topic_point_value": 30,
          "created_at": "2025-12-14T10:35:00Z"
        }
      ],
      "created_at": "2025-12-14T10:34:00Z"
    }
  ],
  "created_at": "2025-12-14T10:32:00Z"
}
```

---

## Interactive API Documentation

For interactive API documentation and testing, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

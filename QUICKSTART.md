# 🚀 Goal Tracker - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- Python 3.8+ installed

## 🎯 Complete Setup (Backend + Frontend)

### Step 1: Start the Backend Server

```bash
# Navigate to server directory
cd server

# Create virtual environment (if not exists)
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Linux/Mac
# OR
venv\Scripts\activate     # On Windows

# Install dependencies
pip install -r requirements.txt

# Run the server
python run.py
```

✅ Backend should be running at: **http://localhost:8000**
✅ API Docs available at: **http://localhost:8000/docs**

### Step 2: Start the Frontend

Open a NEW terminal window:

```bash
# Navigate to client directory
cd client

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

✅ Frontend should be running at: **http://localhost:3000**

## 🎨 Using the Application

### 1. Create an Account
- Go to http://localhost:3000
- You'll be redirected to the login page
- Click "Sign up" 
- Fill in your details:
  - Name: Your Full Name
  - Email: your@email.com
  - Password: your password
  - Phone (optional)
  - Occupation (optional)
- Click "Sign Up"

### 2. Dashboard
- After signup/login, you'll see the dashboard
- View statistics: Total Goals, Points, Today's Progress
- See a chart of your last 7 days progress
- View all your goals with progress bars

### 3. Create Your First Goal
- Click on "Goals" in the navigation
- Click "New Goal" button
- Fill in the details:
  - **Title**: e.g., "Learn Python"
  - **Description**: "Master Python programming"
  - **Initial Value**: 0
  - **Target Value**: 100 (points you want to achieve)
  - **Reward Type**: "Points"
  - **Domain**: "Programming"
  - **Target Date**: Select a future date
- Click "Create Goal"

### 4. Add Resources to Your Goal
- Click on a goal card to view details
- Click "Add Resource" button
- Fill in the details:
  - **Resource Type**: Book, Course, Video, etc.
  - **Title**: e.g., "Python Crash Course"
  - **Value Per Unit**: 10 (points per topic)
  - **Time Per Unit**: "30 minutes"
  - **Link**: URL to the resource (optional)
  - **Notes**: Any additional notes
- Click "Add Resource"

### 5. Add Topics to Track Progress
- Click on a resource card to view details
- You can add topics in two ways:

**Single Topic:**
- Click "Add Topic"
- Enter topic title: "Chapter 1: Introduction"
- Set point multiplier: 1.0 (default)
- Click "Add Topic"

**Bulk Topics:**
- Click "Bulk Add"
- Enter topics one per line:
  ```
  Chapter 1: Introduction
  Chapter 2: Variables
  Chapter 3: Functions
  Chapter 4: Classes
  ```
- Click "Add Topics"

### 6. Track Your Progress
- Click the circle icon next to a topic to mark it as complete ✅
- Click the skip icon to mark as skipped
- View your progress bar update in real-time
- Check the dashboard to see your overall progress

## 📱 Navigation

- **Dashboard**: View all your stats and progress
- **Goals**: List all goals, create new ones
- **Resources**: View all resources across all goals
- **Profile Icon**: Your name and logout button

## 🎯 Understanding the Metrics

### Dashboard Shows:
- **Total Goals**: How many goals you've created
- **Total Points**: All points earned across goals
- **Today's Points**: Points you earned today
- **Avg Completion**: Average completion percentage

### Goal Details Show:
- **Current Value**: Your current progress
- **Target Value**: Your goal
- **Completed Points**: Points you've earned
- **Remaining Days**: Days until target date
- **Today's Progress**: What you completed today

### Resource Details Show:
- **Completion %**: Percentage of topics completed
- **Topics**: Total number of topics
- **Progress Bar**: Visual representation

## 💡 Pro Tips

1. **Set Realistic Goals**: Start with achievable targets
2. **Break Down Learning**: Add multiple topics for each resource
3. **Daily Tracking**: Check in daily to maintain momentum
4. **Use Point Multipliers**: Assign higher values to harder topics
5. **Add Links**: Keep all your learning resources organized
6. **Review Progress**: Check the dashboard regularly

## 🐛 Troubleshooting

### Backend Not Starting?
```bash
# Check if port 8000 is already in use
lsof -i :8000  # On Linux/Mac
netstat -ano | findstr :8000  # On Windows

# Make sure you're in the server directory
cd server
source venv/bin/activate
python run.py
```

### Frontend Not Starting?
```bash
# Check if port 3000 is already in use
lsof -i :3000  # On Linux/Mac
netstat -ano | findstr :3000  # On Windows

# Clear cache and restart
rm -rf .next node_modules
npm install
npm run dev
```

### Can't Login?
- Make sure backend is running
- Check console for errors (F12 in browser)
- Verify API URL in `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8000/api`

### API Errors?
- Backend must be running at http://localhost:8000
- Check backend terminal for error messages
- Visit http://localhost:8000/docs to test APIs directly

## 📚 Example Workflow

Here's a complete example:

1. **Create Goal**: "Learn Python in 3 Months"
   - Initial: 0
   - Target: 500 points
   - Target Date: 3 months from now

2. **Add Resource**: "Python Crash Course (Book)"
   - Value per unit: 10 points
   - Time per unit: "30 minutes"

3. **Add Topics** (Bulk):
   ```
   Chapter 1: Getting Started
   Chapter 2: Variables and Data Types
   Chapter 3: Lists and Tuples
   Chapter 4: Dictionaries
   Chapter 5: If Statements
   Chapter 6: While Loops
   Chapter 7: Functions
   Chapter 8: Classes
   Chapter 9: Files
   Chapter 10: Testing
   ```

4. **Track Progress**:
   - Complete chapters daily
   - Watch your progress bar fill up
   - See points accumulate on dashboard
   - Monitor if you're on track to meet your target

5. **Add More Resources**:
   - YouTube tutorials
   - Online courses
   - Practice projects

## 🎉 You're All Set!

Start tracking your goals and achieve more! The application will help you:
- ✅ Stay organized
- ✅ Track progress visually
- ✅ Maintain motivation
- ✅ Achieve your learning goals

## 📧 Need Help?

- Check the API documentation: http://localhost:8000/docs
- Review the code in `client/` and `server/` directories
- Check browser console for frontend errors
- Check server terminal for backend errors

Happy goal tracking! 🎯

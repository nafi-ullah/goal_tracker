"""
Create the apis according to the database schema below:
APIS
1. Create, Get all, Update, Delete activity types
2. Create, Get all by user_id, Update, Delete todo sections
3. Create, Get all by section_id, Update, Delete todos
4. Get all sections , all todos, all calendar events by user_id for a specific day in a single api
5. Update daily priority for a user for a specific day
6. Get all daily activities by daily_priority_id
7. POST api to reorder daily activities for a specific day by updating their priority_order field





database schema:
-- 6. ACTIVITY TYPES
-- Corresponds to the list on the right: "Study, Office, Wakeup, Idle..."
CREATE TABLE activity_types (
    activity_type_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'Study', 'Office', 'Social'
    icon_name VARCHAR(50)             -- Optional: for UI icons
);



-- 7. TODO SECTIONS
-- Corresponds to "daily_todo_section" 
CREATE TABLE todo_sections (
    section_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,               -- "section_title"
    description TEXT,                          -- "section_description"
    linked_activity_id INTEGER REFERENCES activity_types(activity_type_id), -- "activity_id" (Link section to an activity type)
);

-- 8. TODOS
-- Corresponds to "todo_activities" 
CREATE TABLE todos (
    todo_id SERIAL PRIMARY KEY,
    section_id INTEGER REFERENCES todo_sections(section_id) ON DELETE CASCADE, -- "cat_id" / "category_id"
    title VARCHAR(255) NOT NULL,               -- "title"
    description TEXT,                          -- "description"
    priority_level VARCHAR(20) CHECK (priority_level IN ('Urgent', 'Medium', 'Less')), -- "priority" (Urgent deadline, medium, less)
    approx_time_to_complete INTERVAL,          -- "approx time to complete"
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. CALENDAR EVENTS
CREATE TABLE calendar_events (
    event_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    activity_type_id INTEGER REFERENCES activity_types(activity_type_id),
    event_start TIMESTAMP NOT NULL,
    event_end TIMESTAMP,
    
);

-- 10. DAILY PRIORITY
CREATE TABLE daily_priority (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    description TEXT,
    day_type // working day,office holiday, festive holiday ,self healing day
    date DATETIME,
    no_slots INTEGER, // default 10 
);

// next days task: calander ta fixed , meeting er time / namazer time gula default hoye jabe task a 
// todo er ta urgent priority dekhbe 

-- 11. DAILY ACTIVITIES (Time Tracking)
CREATE TABLE daily_activities (
    daily_activity_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    activity_type_id INTEGER REFERENCES activity_types(activity_type_id),
    daily_priority_id INTEGER REFERENCES daily_priority(id),
    title VARCHAR(100),                        -- Optional specific title
    start_time TIMESTAMP NOT NULL,             -- "start_time"
    end_time TIMESTAMP,                        -- "end_time"
    table_name VARCHAR(50),                     -- e.g., 'todo', 'goal', 'calander'
    table_entry_id INTEGER,                     -- ID of the entry in the corresponding table
    priority_order INTEGER,                      -- Order of priority for the day
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

"""
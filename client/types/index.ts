// Type definitions for Goal Tracker API

export interface User {
  user_id: number;
  name: string;
  email: string;
  phone?: string;
  occupation?: string;
  created_at: string;
}

export interface Goal {
  goal_id: number;
  user_id: number;
  title: string;
  description?: string;
  reward_type?: string;
  target_value?: number;
  initial_value?: number;
  domain_name?: string;
  initial_date?: string;
  target_date?: string;
  created_at: string;
}

export interface Resource {
  resource_id: number;
  goal_id: number;
  resource_type: string;
  title: string;
  value_per_unit?: number;
  total_time_per_unit?: string;
  resource_link?: string;
  note?: string;
  created_at: string;
}

export interface Topic {
  topic_id: number;
  resource_id: number;
  title: string;
  point_multiplier: number;
  is_completed: boolean;
  is_skipped: boolean;
  complete_date?: string;
  created_at: string;
}

// Detailed response types with calculations
export interface TopicDetail extends Topic {
  topic_point_value: number;
}

export interface ResourceDetail extends Resource {
  total_topic_points: number;
  completed_points_resources: number;
  topics: TopicDetail[];
}

export interface GoalDetail extends Goal {
  goals_total_points: number;
  increment_goal_value_per_point: number;
  completed_points_goal: number;
  current_goal_value: number;
  from_today_remaining_days?: number;
  daily_target_points?: number;
  daily_target_value?: number;
  todays_completed_points: number;
  todays_completed_value: number;
  todays_completion_percentage?: number;
  resources: ResourceDetail[];
}

// Form data types
export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  occupation?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateGoalData {
  user_id: number;
  title: string;
  description?: string;
  reward_type?: string;
  target_value?: number;
  initial_value?: number;
  domain_name?: string;
  initial_date?: string;
  target_date?: string;
}

export interface CreateResourceData {
  goal_id: number;
  resource_type: string;
  title: string;
  value_per_unit?: number;
  total_time_per_unit?: string;
  resource_link?: string;
  note?: string;
}

export interface CreateTopicData {
  resource_id: number;
  title: string;
  point_multiplier?: number;
  is_completed?: boolean;
  is_skipped?: boolean;
}

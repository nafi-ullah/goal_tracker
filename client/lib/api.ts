// API Configuration and Helper Functions
const API_BASE_URL = 'https://goal-tracker-ivory.vercel.app/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new ApiError(response.status, error.detail || 'An error occurred');
  }

  return response.json();
}

// User API
export const userApi = {
  signup: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    occupation?: string;
  }) => fetchApi('/users/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  login: (data: { email: string; password: string }) =>
    fetchApi('/users/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getUser: (userId: number) => fetchApi(`/users/${userId}`),

  updateUser: (userId: number, data: Partial<{
    name: string;
    phone: string;
    occupation: string;
  }>) => fetchApi(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  changePassword: (userId: number, data: {
    old_password: string;
    new_password: string;
  }) => fetchApi(`/users/${userId}/change-password`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  deleteUser: (userId: number) => fetchApi(`/users/${userId}`, {
    method: 'DELETE',
  }),
};

// Goal API
export const goalApi = {
  create: (data: {
    user_id: number;
    title: string;
    description?: string;
    reward_type?: string;
    target_value?: number;
    initial_value?: number;
    domain_name?: string;
    initial_date?: string;
    target_date?: string;
  }) => fetchApi('/goals/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getByUser: (userId: number) => fetchApi(`/goals/user/${userId}`),

  getDetailsById: (userId: number) =>
    fetchApi(`/goals/user/${userId}/details`),

  getById: (goalId: number) => fetchApi(`/goals/${goalId}`),

  update: (goalId: number, data: Partial<{
    title: string;
    description: string;
    reward_type: string;
    target_value: number;
    initial_value: number;
    domain_name: string;
    initial_date: string;
    target_date: string;
  }>) => fetchApi(`/goals/${goalId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (goalId: number) => fetchApi(`/goals/${goalId}`, {
    method: 'DELETE',
  }),
};

// Resource API
export const resourceApi = {
  create: (data: {
    goal_id: number;
    resource_type: string;
    title: string;
    value_per_unit?: number;
    total_time_per_unit?: string;
    resource_link?: string;
    note?: string;
  }) => fetchApi('/resources/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getByGoal: (goalId: number) => fetchApi(`/resources/goal/${goalId}`),

  getById: (resourceId: number) => fetchApi(`/resources/${resourceId}`),

  update: (resourceId: number, data: Partial<{
    resource_type: string;
    title: string;
    value_per_unit: number;
    total_time_per_unit: string;
    resource_link: string;
    note: string;
  }>) => fetchApi(`/resources/${resourceId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (resourceId: number) => fetchApi(`/resources/${resourceId}`, {
    method: 'DELETE',
  }),
};

// Topic API
export const topicApi = {
  create: (data: {
    resource_id: number;
    title: string;
    point_multiplier?: number;
    is_completed?: boolean;
    is_skipped?: boolean;
  }) => fetchApi('/topics/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  bulkCreate: (data: {
    resource_id: number;
    topics: Array<{
      title: string;
      point_multiplier?: number;
    }>;
  }) => fetchApi('/topics/bulk', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getByResource: (resourceId: number) =>
    fetchApi(`/topics/resource/${resourceId}`),

  getById: (topicId: number) => fetchApi(`/topics/${topicId}`),

  update: (topicId: number, data: Partial<{
    title: string;
    point_multiplier: number;
    is_completed: boolean;
    is_skipped: boolean;
  }>) => fetchApi(`/topics/${topicId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  updateStatus: (topicId: number, data: {
    is_completed?: boolean;
    is_skipped?: boolean;
  }) => fetchApi(`/topics/${topicId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  delete: (topicId: number) => fetchApi(`/topics/${topicId}`, {
    method: 'DELETE',
  }),
};

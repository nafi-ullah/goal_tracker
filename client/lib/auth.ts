// Authentication and User Session Management
import { User } from '@/types';

const USER_KEY = 'goal_tracker_user';

export const auth = {
  // Store user in localStorage
  setUser: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  // Get user from localStorage
  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  // Remove user from localStorage
  removeUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_KEY);
    }
  },

  // Check if user is logged in
  isAuthenticated: (): boolean => {
    return auth.getUser() !== null;
  },

  // Get user ID
  getUserId: (): number | null => {
    const user = auth.getUser();
    return user?.user_id || null;
  },
};

import api from '@/lib/api';
import { LoginRequest, RegisterRequest, User } from '@/types';

// All auth-related API calls in one place.
// /auth/vendors and /auth/users now return UserResponse from the backend
// (no password field) — the User type on the frontend already has no password,
// so the mapping is correct.

export const authApi = {

  register: async (data: RegisterRequest) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  login: async (data: LoginRequest) => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  // Returns list of vendors — backend now sends UserResponse (no password)
  getVendors: async (): Promise<User[]> => {
    const res = await api.get('/auth/vendors');
    return res.data;
  },

  // ADMIN: returns all users — backend sends UserResponse (no password)
  getAllUsers: async (): Promise<User[]> => {
    const res = await api.get('/auth/users');
    return res.data;
  },

  // ADMIN: delete a user by id
  deleteUser: async (userId: string) => {
    const res = await api.delete(`/auth/users/${userId}`);
    return res.data;
  },

    updateProfile: async (
    userId: string,
    name: string,
    email: string,
    newPassword?: string
  ) => {
    const res = await api.patch(`/auth/users/${userId}`, {
      name,
      email,
      ...(newPassword ? { newPassword } : {}), // only send if provided
    });
    return res.data;
  },
};
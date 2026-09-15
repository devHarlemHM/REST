import api from './axiosInstance';
import type { LoginResponse, User } from '../types';

export const authApi = {
  login: async (correo: string, contrasena: string): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/api/auth/login', { correo, contrasena });
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/api/users/profile');
    return data.data ?? data;
  },
};

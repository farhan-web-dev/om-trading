import { api } from '../api';

export const userApi = {
  getMe: async () => {
    const response = await api.get('/user/me');
    return response.data;
  },

  update: async (data: any) => {
    const response = await api.put('/user/update', data);
    return response.data;
  },

  updateSecurity: async (data: { currentPassword?: string; newPassword?: string; enable2FA?: boolean }) => {
    const response = await api.put('/user/security', data);
    return response.data;
  },
};

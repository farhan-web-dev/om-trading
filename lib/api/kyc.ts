import { api } from '../api';

export const kycApi = {
  submitKyc: async (formData: FormData) => {
    const response = await api.post('/kyc/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getStatus: async () => {
    const response = await api.get('/kyc/status');
    return response.data;
  },
};

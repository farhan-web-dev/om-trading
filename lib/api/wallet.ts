import { api } from '../api';

export const walletApi = {
  getBalance: async () => {
    const response = await api.get('/wallet/balance');
    return response.data;
  },

  deposit: async (data: { amount: number; currency: string }) => {
    const response = await api.post('/wallet/deposit', data);
    return response.data;
  },

  withdrawRequest: async (data: { amount: number; currency: string; address: string }) => {
    const response = await api.post('/wallet/withdraw-request', data);
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/wallet/history');
    return response.data;
  },
};

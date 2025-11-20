import { api } from '../api';

export const portfolioApi = {
  getData: async () => {
    const response = await api.get('/portfolio/data');
    return response.data;
  },
};

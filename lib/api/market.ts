import { api } from '../api';

export const marketApi = {
  getPrices: async () => {
    const response = await api.get('/market/prices');
    return response.data;
  },

  getOrderbook: async (symbol: string) => {
    const response = await api.get(`/market/orderbook/${symbol}`);
    return response.data;
  },

  getCoinDetail: async (symbol: string) => {
    const response = await api.get(`/market/coin/${symbol}`);
    return response.data;
  },

  getRecentTrades: async (symbol: string) => {
    const response = await api.get(`/market/trades/${symbol}`);
    return response.data;
  },
};

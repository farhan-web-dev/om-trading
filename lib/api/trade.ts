import { api } from '../api';

export interface TradeOrder {
  symbol: string;
  type: 'market' | 'limit';
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  leverage?: number;
}

export const tradeApi = {
  buy: async (order: TradeOrder) => {
    const response = await api.post('/trade/buy', order);
    return response.data;
  },

  sell: async (order: TradeOrder) => {
    const response = await api.post('/trade/sell', order);
    return response.data;
  },

  getOpenPositions: async () => {
    const response = await api.get('/trade/open');
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/trade/history');
    return response.data;
  },

  closePosition: async (positionId: string) => {
    const response = await api.post(`/trade/close/${positionId}`);
    return response.data;
  },
};

'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TradingChart } from '@/components/charts/TradingChart';
import { tradeApi, TradeOrder } from '@/lib/api/trade';
import { marketApi } from '@/lib/api/market';
import { walletApi } from '@/lib/api/wallet';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function TradePage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const queryClient = useQueryClient();

  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [leverage, setLeverage] = useState([1]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  const { data: coinDetail } = useQuery({
    queryKey: ['coin', symbol],
    queryFn: () => marketApi.getCoinDetail(symbol),
  });

  const { data: balance } = useQuery({
    queryKey: ['balance'],
    queryFn: walletApi.getBalance,
  });

  const { data: openPositions } = useQuery({
    queryKey: ['openPositions'],
    queryFn: tradeApi.getOpenPositions,
  });

  const tradeMutation = useMutation({
    mutationFn: (order: TradeOrder) => (side === 'buy' ? tradeApi.buy(order) : tradeApi.sell(order)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['openPositions'] });
      setShowConfirmDialog(false);
      setAmount('');
      setPrice('');
    },
  });

  const closePositionMutation = useMutation({
    mutationFn: tradeApi.closePosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['openPositions'] });
    },
  });

  useEffect(() => {
    const mockData = Array.from({ length: 100 }, (_, i) => {
      const basePrice = 50000 + i * 100;
      const random = Math.random() * 1000;
      return {
        time: new Date(Date.now() - (100 - i) * 3600000).toISOString(),
        open: basePrice + random,
        high: basePrice + random + Math.random() * 500,
        low: basePrice + random - Math.random() * 500,
        close: basePrice + random + (Math.random() - 0.5) * 300,
      };
    });
    setChartData(mockData);
  }, []);

  const handleTrade = () => {
    setShowConfirmDialog(true);
  };

  const confirmTrade = () => {
    const order: TradeOrder = {
      symbol,
      type: orderType,
      side,
      amount: parseFloat(amount),
      price: orderType === 'limit' ? parseFloat(price) : undefined,
      leverage: leverage[0],
    };
    tradeMutation.mutate(order);
  };

  const total = orderType === 'limit'
    ? parseFloat(amount || '0') * parseFloat(price || '0')
    : parseFloat(amount || '0') * (coinDetail?.price || 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Trade {symbol}</h1>
          <p className="text-muted-foreground">Current Price: ${coinDetail?.price?.toFixed(2) || '0.00'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <TradingChart data={chartData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Tabs value={side} onValueChange={(v) => setSide(v as 'buy' | 'sell')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buy" className="data-[state=active]:bg-success">Buy</TabsTrigger>
                  <TabsTrigger value="sell" className="data-[state=active]:bg-error">Sell</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <Tabs value={orderType} onValueChange={(v) => setOrderType(v as 'market' | 'limit')} className="mb-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="market">Market</TabsTrigger>
                  <TabsTrigger value="limit">Limit</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-4">
                <div>
                  <Label>Available Balance</Label>
                  <div className="text-2xl font-bold">${balance?.available?.toFixed(2) || '0.00'}</div>
                </div>

                {orderType === 'limit' && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ({symbol})</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Leverage</Label>
                    <span className="text-sm font-semibold">{leverage[0]}x</span>
                  </div>
                  <Slider
                    value={leverage}
                    onValueChange={setLeverage}
                    min={1}
                    max={125}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1x</span>
                    <span>25x</span>
                    <span>50x</span>
                    <span>100x</span>
                    <span>125x</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className={`w-full ${side === 'buy' ? 'bg-success hover:bg-success/90' : 'bg-error hover:bg-error/90'}`}
                  onClick={handleTrade}
                  disabled={!amount || (orderType === 'limit' && !price)}
                >
                  {side === 'buy' ? 'Buy' : 'Sell'} {symbol}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            {openPositions && openPositions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2">Symbol</th>
                      <th className="text-left py-3 px-2">Side</th>
                      <th className="text-right py-3 px-2">Amount</th>
                      <th className="text-right py-3 px-2">Entry Price</th>
                      <th className="text-right py-3 px-2">Current Price</th>
                      <th className="text-right py-3 px-2">Leverage</th>
                      <th className="text-right py-3 px-2">Unrealized P&L</th>
                      <th className="text-right py-3 px-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openPositions.map((position: any) => (
                      <tr key={position.id} className="border-b border-border">
                        <td className="py-4 px-2 font-semibold">{position.symbol}</td>
                        <td className="py-4 px-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            position.side === 'buy' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                          }`}>
                            {position.side.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">{position.amount}</td>
                        <td className="py-4 px-2 text-right">${position.entryPrice?.toFixed(2)}</td>
                        <td className="py-4 px-2 text-right">${position.currentPrice?.toFixed(2)}</td>
                        <td className="py-4 px-2 text-right">{position.leverage}x</td>
                        <td className={`py-4 px-2 text-right font-semibold ${
                          position.unrealizedPnL >= 0 ? 'text-success' : 'text-error'
                        }`}>
                          ${position.unrealizedPnL?.toFixed(2)}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => closePositionMutation.mutate(position.id)}
                            disabled={closePositionMutation.isPending}
                          >
                            Close
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No open positions
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm {side === 'buy' ? 'Buy' : 'Sell'} Order</DialogTitle>
            <DialogDescription>Please review your order details before confirming</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Symbol:</span>
              <span className="font-semibold">{symbol}</span>
              <span className="text-muted-foreground">Side:</span>
              <span className={`font-semibold ${side === 'buy' ? 'text-success' : 'text-error'}`}>
                {side.toUpperCase()}
              </span>
              <span className="text-muted-foreground">Order Type:</span>
              <span className="font-semibold">{orderType.toUpperCase()}</span>
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-semibold">{amount} {symbol}</span>
              {orderType === 'limit' && (
                <>
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-semibold">${price}</span>
                </>
              )}
              <span className="text-muted-foreground">Leverage:</span>
              <span className="font-semibold">{leverage[0]}x</span>
              <span className="text-muted-foreground">Total:</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={confirmTrade}
              disabled={tradeMutation.isPending}
              className={`flex-1 ${side === 'buy' ? 'bg-success hover:bg-success/90' : 'bg-error hover:bg-error/90'}`}
            >
              {tradeMutation.isPending ? 'Processing...' : 'Confirm'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

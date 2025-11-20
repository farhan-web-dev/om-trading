'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TradingChart } from '@/components/charts/TradingChart';
import { marketApi } from '@/lib/api/market';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

export default function MarketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = params.symbol as string;
  const [chartData, setChartData] = useState<any[]>([]);

  const { data: coinDetail } = useQuery({
    queryKey: ['coin', symbol],
    queryFn: () => marketApi.getCoinDetail(symbol),
  });

  const { data: orderbook } = useQuery({
    queryKey: ['orderbook', symbol],
    queryFn: () => marketApi.getOrderbook(symbol),
    refetchInterval: 2000,
  });

  const { data: recentTrades } = useQuery({
    queryKey: ['recentTrades', symbol],
    queryFn: () => marketApi.getRecentTrades(symbol),
    refetchInterval: 3000,
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold">{symbol}</h1>
              <span className="text-muted-foreground">{coinDetail?.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold">${coinDetail?.price?.toFixed(2) || '0.00'}</span>
              <span className={`flex items-center gap-1 ${coinDetail?.change24h >= 0 ? 'text-success' : 'text-error'}`}>
                {coinDetail?.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {coinDetail?.change24h >= 0 ? '+' : ''}{coinDetail?.change24h?.toFixed(2)}%
              </span>
            </div>
          </div>
          <Button onClick={() => router.push(`/trade/${symbol}`)} size="lg" className="gap-2">
            Trade Now
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">24h High</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">${coinDetail?.high24h?.toFixed(2) || '0.00'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">24h Low</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">${coinDetail?.low24h?.toFixed(2) || '0.00'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">24h Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">${coinDetail?.volume24h?.toLocaleString() || '0'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Market Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">${coinDetail?.marketCap?.toLocaleString() || '0'}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <Tabs defaultValue="chart" className="w-full">
                <TabsList>
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="info">Info</TabsTrigger>
                </TabsList>
                <TabsContent value="chart" className="mt-4">
                  <TradingChart data={chartData} />
                </TabsContent>
                <TabsContent value="info" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">About {symbol}</h3>
                      <p className="text-sm">{coinDetail?.description || 'No description available.'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Circulating Supply:</span>
                        <div className="font-semibold">{coinDetail?.circulatingSupply?.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Supply:</span>
                        <div className="font-semibold">{coinDetail?.totalSupply?.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Order Book</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground grid grid-cols-3 gap-2">
                    <span>Price</span>
                    <span className="text-right">Amount</span>
                    <span className="text-right">Total</span>
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin">
                    {orderbook?.asks?.slice(0, 10).map((order: any, i: number) => (
                      <div key={i} className="text-xs grid grid-cols-3 gap-2 text-error">
                        <span>{order.price?.toFixed(2)}</span>
                        <span className="text-right">{order.amount?.toFixed(4)}</span>
                        <span className="text-right">{(order.price * order.amount).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="py-2 text-center font-bold">
                    ${coinDetail?.price?.toFixed(2) || '0.00'}
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin">
                    {orderbook?.bids?.slice(0, 10).map((order: any, i: number) => (
                      <div key={i} className="text-xs grid grid-cols-3 gap-2 text-success">
                        <span>{order.price?.toFixed(2)}</span>
                        <span className="text-right">{order.amount?.toFixed(4)}</span>
                        <span className="text-right">{(order.price * order.amount).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recent Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground grid grid-cols-3 gap-2">
                    <span>Price</span>
                    <span className="text-right">Amount</span>
                    <span className="text-right">Time</span>
                  </div>
                  <div className="space-y-1 max-h-96 overflow-y-auto scrollbar-thin">
                    {recentTrades?.map((trade: any, i: number) => (
                      <div
                        key={i}
                        className={`text-xs grid grid-cols-3 gap-2 ${trade.side === 'buy' ? 'text-success' : 'text-error'}`}
                      >
                        <span>{trade.price?.toFixed(2)}</span>
                        <span className="text-right">{trade.amount?.toFixed(4)}</span>
                        <span className="text-right text-muted-foreground">
                          {new Date(trade.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

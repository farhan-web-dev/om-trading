'use client';

import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { portfolioApi } from '@/lib/api/portfolio';
import { tradeApi } from '@/lib/api/trade';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

const COLORS = ['#FF7A00', '#22C55E', '#EF4444', '#3B82F6', '#A855F7'];

export default function PortfolioPage() {
  const { data: portfolio } = useQuery({
    queryKey: ['portfolio'],
    queryFn: portfolioApi.getData,
  });

  const { data: tradeHistory } = useQuery({
    queryKey: ['tradeHistory'],
    queryFn: tradeApi.getHistory,
  });

  const pnlData = portfolio?.pnlHistory || Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 3600000).toLocaleDateString(),
    value: 10000 + Math.random() * 2000 - 1000,
  }));

  const allocationData = portfolio?.allocation || [
    { name: 'BTC', value: 40 },
    { name: 'ETH', value: 30 },
    { name: 'SOL', value: 15 },
    { name: 'BNB', value: 10 },
    { name: 'Other', value: 5 },
  ];

  const totalPnL = portfolio?.totalPnL || 0;
  const totalInvestment = portfolio?.totalInvestment || 10000;
  const pnlPercentage = (totalPnL / totalInvestment) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
          <p className="text-muted-foreground">Track your investment performance and holdings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${portfolio?.totalValue?.toFixed(2) || '0.00'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-success' : 'text-error'}`}>
                ${totalPnL.toFixed(2)}
              </div>
              <p className={`text-xs mt-1 flex items-center gap-1 ${totalPnL >= 0 ? 'text-success' : 'text-error'}`}>
                {totalPnL >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalInvestment.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tradeHistory?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={pnlData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D0D0D',
                      border: '1px solid #262626',
                      borderRadius: '8px',
                    }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#FF7A00" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {allocationData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D0D0D',
                      border: '1px solid #262626',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Trade History</CardTitle>
          </CardHeader>
          <CardContent>
            {tradeHistory && tradeHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2">Date</th>
                      <th className="text-left py-3 px-2">Symbol</th>
                      <th className="text-left py-3 px-2">Side</th>
                      <th className="text-right py-3 px-2">Amount</th>
                      <th className="text-right py-3 px-2">Entry Price</th>
                      <th className="text-right py-3 px-2">Exit Price</th>
                      <th className="text-right py-3 px-2">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tradeHistory.map((trade: any) => (
                      <tr key={trade.id} className="border-b border-border">
                        <td className="py-4 px-2 text-sm">
                          {new Date(trade.timestamp).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-2 font-semibold">{trade.symbol}</td>
                        <td className="py-4 px-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            trade.side === 'buy' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                          }`}>
                            {trade.side.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">{trade.amount}</td>
                        <td className="py-4 px-2 text-right">${trade.entryPrice?.toFixed(2)}</td>
                        <td className="py-4 px-2 text-right">${trade.exitPrice?.toFixed(2)}</td>
                        <td className={`py-4 px-2 text-right font-semibold ${
                          trade.pnl >= 0 ? 'text-success' : 'text-error'
                        }`}>
                          ${trade.pnl?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No trade history available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

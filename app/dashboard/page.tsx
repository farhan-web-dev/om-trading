"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { walletApi } from "@/lib/api/wallet";
import { marketApi } from "@/lib/api/market";
import { tradeApi } from "@/lib/api/trade";
import { portfolioApi } from "@/lib/api/portfolio";
import { wsService } from "@/lib/websocket";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Activity,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [prices, setPrices] = useState<any[]>([]);

  const { data: balance } = useQuery({
    queryKey: ["balance"],
    queryFn: walletApi.getBalance,
  });

  const { data: openPositions } = useQuery({
    queryKey: ["openPositions"],
    queryFn: tradeApi.getOpenPositions,
  });

  const { data: portfolio } = useQuery({
    queryKey: ["portfolio"],
    queryFn: portfolioApi.getData,
  });

  useEffect(() => {
    marketApi.getPrices().then(setPrices);
    wsService.connect();
    const unsubscribe = wsService.subscribe("prices", (data) => {
      if (data.prices) {
        setPrices(data.prices);
      }
    });

    return () => unsubscribe();
  }, []);

  const totalPnL =
    openPositions?.reduce(
      (sum: number, pos: any) => sum + (pos.unrealizedPnL || 0),
      0
    ) || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your trading overview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
              <Wallet className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${balance?.total?.toFixed(2) || "0.00"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Available: ${balance?.available?.toFixed(2) || "0.00"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  totalPnL >= 0 ? "text-success" : "text-error"
                }`}
              >
                ${totalPnL.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalPnL >= 0 ? "+" : ""}
                {((totalPnL / (balance?.total || 1)) * 100).toFixed(2)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Open Positions
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {openPositions?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active trades
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Portfolio Value
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${portfolio?.totalValue?.toFixed(2) || "0.00"}
              </div>
              <p className="text-xs text-success mt-1">
                +{portfolio?.change24h?.toFixed(2) || "0.00"}%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Market Prices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prices.slice(0, 8).map((coin: any) => (
                  <Link key={coin.symbol} href={`/markets/${coin.symbol}`}>
                    <div className="flex items-center justify-between p-3 hover:bg-secondary rounded-lg cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {coin.symbol?.substring(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold">{coin.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            {coin.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          ${coin.price?.toFixed(2)}
                        </div>
                        <div
                          className={`text-sm flex items-center gap-1 ${
                            coin.change24h >= 0 ? "text-success" : "text-error"
                          }`}
                        >
                          {coin.change24h >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {coin.change24h >= 0 ? "+" : ""}
                          {coin.change24h?.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/markets">
                  <Button variant="outline" className="w-full">
                    View All Markets
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
              {openPositions && openPositions.length > 0 ? (
                <div className="space-y-3">
                  {openPositions.slice(0, 5).map((position: any) => (
                    <div
                      key={position.id}
                      className="p-3 bg-secondary rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{position.symbol}</div>
                          <div className="text-xs text-muted-foreground">
                            {position.side.toUpperCase()}
                          </div>
                        </div>
                        <div
                          className={`text-sm font-semibold ${
                            position.unrealizedPnL >= 0
                              ? "text-success"
                              : "text-error"
                          }`}
                        >
                          ${position.unrealizedPnL?.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Amount: {position.amount} @ ${position.entryPrice}
                      </div>
                    </div>
                  ))}
                  <Link href="/trade/BTC">
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      View All
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No open positions
                  </p>
                  <Link href="/markets">
                    <Button>Start Trading</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// export default function DashboardPage() {
//   return (
//     <div className="text-4xl text-orange-400 flex justify-center items-center min-h-screen">
//       Welcome to OM Trading App
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { marketApi } from '@/lib/api/market';
import { Search, TrendingUp, TrendingDown, Star } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function MarketsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const { data: prices = [], isLoading } = useQuery({
    queryKey: ['prices'],
    queryFn: marketApi.getPrices,
    refetchInterval: 5000,
  });

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const toggleFavorite = (symbol: string) => {
    const newFavorites = favorites.includes(symbol)
      ? favorites.filter((s) => s !== symbol)
      : [...favorites, symbol];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const filteredPrices = prices.filter((coin: any) => {
    const matchesSearch =
      coin.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.name?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'favorites') {
      return matchesSearch && favorites.includes(coin.symbol);
    }
    if (filter === 'gainers') {
      return matchesSearch && coin.change24h > 0;
    }
    if (filter === 'losers') {
      return matchesSearch && coin.change24h < 0;
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Markets</h1>
          <p className="text-muted-foreground">Explore and trade cryptocurrencies</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle>All Cryptocurrencies</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search coins..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Coins</SelectItem>
                    <SelectItem value="favorites">Favorites</SelectItem>
                    <SelectItem value="gainers">Top Gainers</SelectItem>
                    <SelectItem value="losers">Top Losers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading markets...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 w-12"></th>
                      <th className="text-left py-3 px-2">Name</th>
                      <th className="text-right py-3 px-2">Price</th>
                      <th className="text-right py-3 px-2">24h Change</th>
                      <th className="text-right py-3 px-2">24h Volume</th>
                      <th className="text-right py-3 px-2">Market Cap</th>
                      <th className="text-right py-3 px-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrices.map((coin: any) => (
                      <tr
                        key={coin.symbol}
                        className="border-b border-border hover:bg-secondary/50 transition-colors"
                      >
                        <td className="py-4 px-2">
                          <button
                            onClick={() => toggleFavorite(coin.symbol)}
                            className="hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                favorites.includes(coin.symbol)
                                  ? 'fill-primary text-primary'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          </button>
                        </td>
                        <td className="py-4 px-2">
                          <Link href={`/markets/${coin.symbol}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-primary">
                                {coin.symbol?.substring(0, 2)}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold">{coin.symbol}</div>
                              <div className="text-xs text-muted-foreground">{coin.name}</div>
                            </div>
                          </Link>
                        </td>
                        <td className="py-4 px-2 text-right font-semibold">
                          ${coin.price?.toFixed(2) || '0.00'}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <div className={`flex items-center justify-end gap-1 ${coin.change24h >= 0 ? 'text-success' : 'text-error'}`}>
                            {coin.change24h >= 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            <span className="font-semibold">
                              {coin.change24h >= 0 ? '+' : ''}{coin.change24h?.toFixed(2)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-right text-muted-foreground">
                          ${coin.volume24h?.toLocaleString() || '0'}
                        </td>
                        <td className="py-4 px-2 text-right text-muted-foreground">
                          ${coin.marketCap?.toLocaleString() || '0'}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <Link href={`/trade/${coin.symbol}`}>
                            <Button size="sm">Trade</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredPrices.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No coins found matching your criteria
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { walletApi } from '@/lib/api/wallet';
import { Wallet as WalletIcon, ArrowDownCircle, ArrowUpCircle, History } from 'lucide-react';

export default function WalletPage() {
  const queryClient = useQueryClient();
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');

  const { data: balance } = useQuery({
    queryKey: ['balance'],
    queryFn: walletApi.getBalance,
  });

  const { data: history } = useQuery({
    queryKey: ['walletHistory'],
    queryFn: walletApi.getHistory,
  });

  const depositMutation = useMutation({
    mutationFn: walletApi.deposit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['walletHistory'] });
      setShowDepositDialog(false);
      setDepositAmount('');
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: walletApi.withdrawRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['walletHistory'] });
      setShowWithdrawDialog(false);
      setWithdrawAmount('');
      setWithdrawAddress('');
    },
  });

  const handleDeposit = () => {
    depositMutation.mutate({
      amount: parseFloat(depositAmount),
      currency: 'USD',
    });
  };

  const handleWithdraw = () => {
    withdrawMutation.mutate({
      amount: parseFloat(withdrawAmount),
      currency: 'USD',
      address: withdrawAddress,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Wallet</h1>
          <p className="text-muted-foreground">Manage your funds and transaction history</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <WalletIcon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${balance?.total?.toFixed(2) || '0.00'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <ArrowDownCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">${balance?.available?.toFixed(2) || '0.00'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Orders</CardTitle>
              <ArrowUpCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-muted-foreground">
                ${((balance?.total || 0) - (balance?.available || 0)).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Account Status:</span>
                      <div className="font-semibold text-success">Active</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">KYC Status:</span>
                      <div className="font-semibold text-success">Verified</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Deposits:</span>
                      <div className="font-semibold">${balance?.totalDeposits?.toFixed(2) || '0.00'}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Withdrawals:</span>
                      <div className="font-semibold">${balance?.totalWithdrawals?.toFixed(2) || '0.00'}</div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button onClick={() => setShowDepositDialog(true)} className="flex-1 gap-2">
                      <ArrowDownCircle className="w-4 h-4" />
                      Deposit
                    </Button>
                    <Button onClick={() => setShowWithdrawDialog(true)} variant="outline" className="flex-1 gap-2">
                      <ArrowUpCircle className="w-4 h-4" />
                      Withdraw
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deposit">
            <Card>
              <CardHeader>
                <CardTitle>Deposit Funds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-2">Deposit Address (USD)</p>
                    <code className="block p-3 bg-card rounded text-sm break-all">
                      0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
                    </code>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="depositAmount">Amount (USD)</Label>
                    <Input
                      id="depositAmount"
                      type="number"
                      placeholder="0.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={handleDeposit}
                    disabled={!depositAmount || depositMutation.isPending}
                    className="w-full"
                  >
                    {depositMutation.isPending ? 'Processing...' : 'Deposit'}
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    Deposits are typically processed within 10-30 minutes
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw">
            <Card>
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="withdrawAmount">Amount (USD)</Label>
                    <Input
                      id="withdrawAmount"
                      type="number"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Available: ${balance?.available?.toFixed(2) || '0.00'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="withdrawAddress">Withdrawal Address</Label>
                    <Input
                      id="withdrawAddress"
                      placeholder="Enter your wallet address"
                      value={withdrawAddress}
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={handleWithdraw}
                    disabled={!withdrawAmount || !withdrawAddress || withdrawMutation.isPending}
                    className="w-full"
                  >
                    {withdrawMutation.isPending ? 'Processing...' : 'Withdraw'}
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    Withdrawal requests are processed within 24 hours
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {history && history.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2">Date</th>
                          <th className="text-left py-3 px-2">Type</th>
                          <th className="text-right py-3 px-2">Amount</th>
                          <th className="text-left py-3 px-2">Status</th>
                          <th className="text-left py-3 px-2">Transaction ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((transaction: any) => (
                          <tr key={transaction.id} className="border-b border-border">
                            <td className="py-4 px-2 text-sm">
                              {new Date(transaction.timestamp).toLocaleString()}
                            </td>
                            <td className="py-4 px-2">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                transaction.type === 'deposit'
                                  ? 'bg-success/20 text-success'
                                  : 'bg-error/20 text-error'
                              }`}>
                                {transaction.type.toUpperCase()}
                              </span>
                            </td>
                            <td className={`py-4 px-2 text-right font-semibold ${
                              transaction.type === 'deposit' ? 'text-success' : 'text-error'
                            }`}>
                              {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount?.toFixed(2)}
                            </td>
                            <td className="py-4 px-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                transaction.status === 'completed'
                                  ? 'bg-success/20 text-success'
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                {transaction.status}
                              </span>
                            </td>
                            <td className="py-4 px-2 text-sm text-muted-foreground font-mono">
                              {transaction.txId?.substring(0, 16)}...
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No transaction history
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Deposit</DialogTitle>
            <DialogDescription>Deposit funds to your account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quickDepositAmount">Amount (USD)</Label>
              <Input
                id="quickDepositAmount"
                type="number"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowDepositDialog(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleDeposit}
              disabled={!depositAmount || depositMutation.isPending}
              className="flex-1"
            >
              {depositMutation.isPending ? 'Processing...' : 'Deposit'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Withdraw</DialogTitle>
            <DialogDescription>Withdraw funds from your account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quickWithdrawAmount">Amount (USD)</Label>
              <Input
                id="quickWithdrawAmount"
                type="number"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quickWithdrawAddress">Withdrawal Address</Label>
              <Input
                id="quickWithdrawAddress"
                placeholder="Enter your wallet address"
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowWithdrawDialog(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={!withdrawAmount || !withdrawAddress || withdrawMutation.isPending}
              className="flex-1"
            >
              {withdrawMutation.isPending ? 'Processing...' : 'Withdraw'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

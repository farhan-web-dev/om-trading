'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

export default function NotificationsSettingsPage() {
  const [notifications, setNotifications] = useState({
    tradeExecuted: true,
    priceAlerts: true,
    marketNews: false,
    portfolioUpdates: true,
    securityAlerts: true,
    promotions: false,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleSave = () => {
    console.log('Saving notification preferences:', notifications);
  };

  const notificationItems = [
    {
      key: 'tradeExecuted' as const,
      title: 'Trade Executed',
      description: 'Get notified when your trades are executed',
    },
    {
      key: 'priceAlerts' as const,
      title: 'Price Alerts',
      description: 'Receive alerts when prices reach your target',
    },
    {
      key: 'marketNews' as const,
      title: 'Market News',
      description: 'Stay updated with the latest market news',
    },
    {
      key: 'portfolioUpdates' as const,
      title: 'Portfolio Updates',
      description: 'Get updates about your portfolio performance',
    },
    {
      key: 'securityAlerts' as const,
      title: 'Security Alerts',
      description: 'Important security notifications about your account',
    },
    {
      key: 'promotions' as const,
      title: 'Promotions & Offers',
      description: 'Receive promotional offers and special deals',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Notification Settings</h1>
          <p className="text-muted-foreground">Manage your notification preferences</p>
        </div>

        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle>Email Notifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationItems.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-semibold mb-1">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={() => handleToggle(item.key)}
                    />
                  </div>
                ))}

                <div className="pt-4">
                  <Button onClick={handleSave} className="w-full">
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, Shield, FileText, Bell, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const settingsItems = [
    {
      title: 'Profile',
      description: 'Manage your personal information',
      icon: User,
      href: '/settings/profile',
    },
    {
      title: 'Security',
      description: 'Password and two-factor authentication',
      icon: Shield,
      href: '/settings/security',
    },
    {
      title: 'KYC Verification',
      description: 'View and update your verification status',
      icon: FileText,
      href: '/settings/kyc',
    },
    {
      title: 'Notifications',
      description: 'Manage your notification preferences',
      icon: Bell,
      href: '/settings/notifications',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <div className="max-w-3xl space-y-4">
          {settingsItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="hover:bg-secondary/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
